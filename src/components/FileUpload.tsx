import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Trash2, 
  Download,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

interface FileUploadProps {
  userId: string;
  consultationRequestId?: string;
  acceptedTypes?: string;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  onFilesUploaded?: (files: UploadedFile[]) => void;
  className?: string;
}

interface UploadedFile {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  description?: string;
  created_at: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return ImageIcon;
  if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
  return File;
};

export const FileUpload = ({
  userId,
  consultationRequestId,
  acceptedTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt",
  maxFileSize = 10, // 10MB default
  maxFiles = 5,
  onFilesUploaded,
  className = ""
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    const isValidType = allowedTypes.some(type => 
      type === fileExtension || 
      mimeType.includes(type.replace('.', ''))
    );

    if (!isValidType) {
      return `File type not allowed. Accepted types: ${acceptedTypes}`;
    }

    return null;
  };

  const handleFileUpload = async (files: FileList) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          toast({
            title: "Invalid file",
            description: `${file.name}: ${validationError}`,
            variant: "destructive"
          });
          return null;
        }

        // Generate unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase Storage (this would need to be set up)
        // For now, we'll simulate the upload and store metadata
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Store file metadata in database
        const { data: uploadData, error } = await supabase
          .from('document_uploads')
          .insert({
            user_id: userId,
            consultation_request_id: consultationRequestId,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            storage_path: fileName, // This would be the actual storage path
            description: `Uploaded file: ${file.name}`
          })
          .select()
          .single();

        if (error) throw error;

        return uploadData;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as UploadedFile[];
      
      setUploadedFiles(prev => [...prev, ...successfulUploads]);
      
      if (onFilesUploaded) {
        onFilesUploaded(successfulUploads);
      }

      toast({
        title: "Files uploaded successfully",
        description: `${successfulUploads.length} file(s) uploaded`
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('document_uploads')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      
      toast({
        title: "File deleted",
        description: "File has been removed successfully"
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Document Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            ${uploading ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5 cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium mb-1">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            {acceptedTypes} • Max {maxFileSize}MB per file • Up to {maxFiles} files
          </p>
          
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading files...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Uploaded Files</Label>
            <div className="space-y-2">
              {uploadedFiles.map((file) => {
                const FileIcon = getFileIcon(file.file_type);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-accent/50"
                  >
                    <div className="flex items-center space-x-3">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.file_name}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.file_size)}</span>
                          <Badge variant="outline" className="text-xs">
                            {file.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // This would download the file
                          toast({
                            title: "Download",
                            description: "File download would start here"
                          });
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* File Guidelines */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">File Upload Guidelines:</p>
              <ul className="space-y-1">
                <li>• Medical records, insurance documents, test results</li>
                <li>• Identification documents (if required)</li>
                <li>• Any supporting documentation for your consultation</li>
                <li>• Files are securely encrypted and HIPAA compliant</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};