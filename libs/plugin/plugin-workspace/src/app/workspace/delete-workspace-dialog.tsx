// import { useState } from 'react';
// import { TrashIcon } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@paintress/paintress-ui/components/ui/dialog';
// import { Button } from '@paintress/paintress-ui/components/ui/button';
// import { Workspace } from '@paintress/paintress-ui/types/workspace';

// interface DeleteWorkspaceDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   workspace: Workspace | null;
//   onDelete: (workspaceId: string) => Promise<void>;
// }

// export function DeleteWorkspaceDialog({
//   open,
//   onOpenChange,
//   workspace,
//   onDelete,
// }: DeleteWorkspaceDialogProps) {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDelete = async () => {
//     if (!workspace) return;

//     try {
//       setIsDeleting(true);
//       await onDelete(workspace.id);
//       onOpenChange(false);
//     } catch (error) {
//       console.error('Failed to delete workspace:', error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
//               <TrashIcon className="size-6 text-red-600 dark:text-red-400" />
//             </div>
//             <div>
//               <DialogTitle>Delete Workspace</DialogTitle>
//               <DialogDescription>
//                 Are you sure you want to delete "{workspace?.name}"?
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="bg-muted p-4 rounded-lg">
//             <p className="text-sm text-muted-foreground">
//               <strong>Warning:</strong> This action will permanently remove the
//               workspace from your list. If this is a local workspace, the files
//               in your folder will remain unchanged, but you'll need to restore
//               the workspace to access it again.
//             </p>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant="destructive"
//             onClick={handleDelete}
//             disabled={isDeleting}
//           >
//             {isDeleting ? 'Deleting...' : 'Delete Workspace'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
