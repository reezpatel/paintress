-- Create workspace table
--
-- ROLLBACK INSTRUCTIONS:
-- To rollback this migration, run:
-- DROP INDEX IF EXISTS idx_workspace_user_id;
-- DROP TABLE IF EXISTS public.workspace;
--
CREATE TABLE public.workspace (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    workspace_config JSON NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on workspace table
ALTER TABLE public.workspace ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to view their own workspaces
CREATE POLICY "Individuals can view their own workspaces"
ON public.workspace FOR SELECT
USING ( (SELECT auth.uid()) = user_id );

-- Create RLS policy for users to insert their own workspaces
CREATE POLICY "Individuals can create their own workspaces"
ON public.workspace FOR INSERT
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- Create RLS policy for users to update their own workspaces
CREATE POLICY "Individuals can update their own workspaces"
ON public.workspace FOR UPDATE
USING ( (SELECT auth.uid()) = user_id );

-- Create RLS policy for users to delete their own workspaces
CREATE POLICY "Individuals can delete their own workspaces"
ON public.workspace FOR DELETE
USING ( (SELECT auth.uid()) = user_id );

-- Create index for better performance on user_id queries
CREATE INDEX idx_workspace_user_id ON public.workspace(user_id);


