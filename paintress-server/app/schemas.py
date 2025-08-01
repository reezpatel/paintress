"""Pydantic schemas for request/response models."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Book schemas
class BookBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None


class BookResponse(BookBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    class Config:
        from_attributes = True


# Note schemas
class NoteBase(BaseModel):
    name: str
    icon: Optional[str] = None
    parent_note_id: Optional[str] = None
    is_encrypted: bool = False
    public_key: Optional[str] = None


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    parent_note_id: Optional[str] = None
    is_encrypted: Optional[bool] = None
    public_key: Optional[str] = None


class NoteResponse(NoteBase):
    id: str
    book_id: str
    current_version: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    class Config:
        from_attributes = True


# Node schemas
class NodeBase(BaseModel):
    node_index: int
    node_content: str


class NodeCreate(NodeBase):
    pass


class NodeUpdate(BaseModel):
    node_index: Optional[int] = None
    node_content: Optional[str] = None


class NodeResponse(NodeBase):
    id: str
    note_id: str
    version_id: int
    created_at: datetime
    created_by: str

    class Config:
        from_attributes = True


# Attachment schemas
class AttachmentBase(BaseModel):
    original_filename: str
    mime_type: str
    file_size: int


class AttachmentResponse(AttachmentBase):
    id: str
    user_id: str
    file_path: str
    created_at: datetime
    is_deleted: bool

    class Config:
        from_attributes = True


# Authentication schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleLogin(BaseModel):
    google_token: str


class ClerkLogin(BaseModel):
    clerk_token: str


class ApplicationConfig(BaseModel):
    auth_type: str  # "clerk" or "traditional"
    app_name: str
    version: str


# Response schemas
class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str
