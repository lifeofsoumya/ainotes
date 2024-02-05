import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";

interface AddNoteDialogProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    noteToEdit?: Note
}

export default function AddNoteDialog({open, setOpen, noteToEdit} : AddNoteDialogProps){
    const [deleteInProgress, setDeleteInProgress] = useState(false)
    const router = useRouter();
    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: noteToEdit?.title || '',
            content: noteToEdit?.content || ''
        }
    })
    async function onSubmit(input: CreateNoteSchema){
        try {
            if(noteToEdit) {
                const res = await fetch("/api/notes",{
                    method: "PUT",
                    body: JSON.stringify({
                        id: noteToEdit.id,
                        ...input
                    })
                })
                if(!res.ok) throw Error("Status code: " + res?.status)
            } else{
                const response = await fetch("/api/notes",{
                    method: "POST",
                    body: JSON.stringify(input)
                })
                if(!response.ok) throw Error("Status code: " + response?.status)
                form.reset();
            }
            router.refresh(); // have to check for alternatives
            setOpen(false);

        } catch (error) {
            console.error(error);
            alert('something went wrong')
        }
    }

    async function deleteNote() {
        if(!noteToEdit) return;
        try {
            setDeleteInProgress(true);
            const res = await fetch("/api/notes",{
                method: "DELETE",
                body: JSON.stringify({
                    id: noteToEdit.id
                })
            })
            if(!res.ok) throw Error("status code: " + res.status)
        } catch (error) {
            console.error('Something went wrong ', error)
        } finally{
            setDeleteInProgress(false);
            router.refresh();
        }
    }
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">{noteToEdit ? "Edit" : "Add"} Note</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Note Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Note title" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Note Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Note content" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-2 sm:gap-0">
                            {noteToEdit && (
                                <LoadingButton variant="destructive" onClick={deleteNote} loading={deleteInProgress} disabled={form.formState.isSubmitting} type="button">
                                    Delete
                                </LoadingButton>
                            )}
                            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                                Submit
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}  