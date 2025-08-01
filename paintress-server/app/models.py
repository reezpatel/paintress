"""Database models for the Notes App."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    """User model for authentication and profile data."""

    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable for Google OAuth users
    google_id = Column(String, unique=True, nullable=True)
    clerk_id = Column(String, unique=True, nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    # Relationships
    books = relationship("Book", back_populates="user", cascade="all, delete-orphan")
    attachments = relationship(
        "Attachment", back_populates="user", cascade="all, delete-orphan"
    )
    nodes = relationship("Node", back_populates="created_by_user")


class Book(Base):
    """Book model for organizing notes."""

    __tablename__ = "books"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="books")
    notes = relationship("Note", back_populates="book", cascade="all, delete-orphan")


class Note(Base):
    """Note model with encryption support and hierarchical structure."""

    __tablename__ = "notes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    book_id = Column(String, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    parent_note_id = Column(
        String, ForeignKey("notes.id", ondelete="SET NULL"), nullable=True
    )
    is_encrypted = Column(Boolean, default=False)
    public_key = Column(Text, nullable=True)  # For client-side encryption
    current_version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    # Relationships
    book = relationship("Book", back_populates="notes")
    parent_note = relationship("Note", remote_side=[id], backref="child_notes")
    nodes = relationship("Node", back_populates="note", cascade="all, delete-orphan")


class Node(Base):
    """Node model for versioned note content."""

    __tablename__ = "nodes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    note_id = Column(String, ForeignKey("notes.id", ondelete="CASCADE"), nullable=False)
    version_id = Column(Integer, nullable=False)
    node_index = Column(Integer, nullable=False)
    node_content = Column(
        Text, nullable=False
    )  # Encrypted content if note.is_encrypted=True
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)

    # Relationships
    note = relationship("Note", back_populates="nodes")
    created_by_user = relationship("User", back_populates="nodes")


class Attachment(Base):
    """Attachment model for file uploads."""

    __tablename__ = "attachments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="attachments")
