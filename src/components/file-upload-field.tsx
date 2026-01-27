import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger
} from "@/components/ui/file-upload.tsx";
import { IconTrashX, IconUpload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button.tsx";
import { useCallback } from "react";
import { toast } from "sonner";


export const FileUploadField = ({ projectFiles: files, setProjectFiles: setFiles }: FileUploadFieldProps) => {

    const onFileValidate = useCallback((file: File): string | null => {
        if (files.length >= 1) {
            return "You can only upload one REAPER project file."
        }

        if (!file.name.toLowerCase().endsWith(".rpp")) {
            return "Only valid REAPER project files (.rpp) are accepted.";
        }

        return null
    }, [files])

    const onFileReject = useCallback((_: File, message: string) => {
        toast.error(message);
    }, []);

    const onFileAccept = useCallback((file: File) => setFiles([file]), [setFiles])

    return <FileUpload
        value={files}
        onFileValidate={onFileValidate}
        onFileReject={onFileReject}
        onFileAccept={onFileAccept}
        accept=".rpp"
        multiple={false}
        className="w-full"
    >
        {files.length > 0 ? null : <FileUploadDropzone
            className="flex-row items-center justify-between border max-h-16 p-3">
            <div className="flex items-center gap-4 text-center">
                <div className="flex items-center justify-center rounded border p-2 size-10">
                    <IconUpload className="size-4 text-muted-foreground" />
                </div>
                <div className="text-left">
                    <p className="font-medium text-sm">Drop a REAPER project here</p>
                    <p className="text-sm text-muted-foreground">REAPER project file (.rpp)</p>
                </div>
            </div>
            <FileUploadTrigger asChild>
                <Button type="button" variant="default" size="sm" className="w-fit">
                    Browse files
                </Button>
            </FileUploadTrigger>
        </FileUploadDropzone>}
        <FileUploadList>
            {files.map((file) => (
                <FileUploadItem key={file.name + file.lastModified} value={file} className="max-h-16">
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete>
                        <Button type="button" variant="ghost" size="icon" className="size-7 hover:text-destructive" aria-label="Remove file" onClick={() => setFiles([])}>
                            <IconTrashX aria-hidden />
                        </Button>
                    </FileUploadItemDelete>
                </FileUploadItem>
            ))}
        </FileUploadList>
    </FileUpload>;
}


interface FileUploadFieldProps {
    projectFiles: File[];
    setProjectFiles: (files: File[]) => void;
}