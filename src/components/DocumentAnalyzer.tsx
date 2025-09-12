import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, Brain, Loader2, Copy } from 'lucide-react';

const DocumentAnalyzer = () => {
  const [documentText, setDocumentText] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const documentTypes = [
    { value: 'lab_result', label: 'Lab Results' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'medical_report', label: 'Medical Report' },
    { value: 'general', label: 'General Medical Document' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      toast({
        title: "Error",
        description: "Please upload a text file (.txt)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setDocumentText(text);
    };
    reader.readAsText(file);
  };

  const analyzeDocument = async () => {
    if (!documentText.trim()) {
      toast({
        title: "Error",
        description: "Please enter or upload document text",
        variant: "destructive",
      });
      return;
    }

    if (!documentType) {
      toast({
        title: "Error",
        description: "Please select a document type",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-health-document', {
        body: {
          text: documentText,
          documentType
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Success",
        description: "Document analyzed successfully",
      });
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        title: "Error",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyAnalysis = () => {
    navigator.clipboard.writeText(analysis);
    toast({
      title: "Copied",
      description: "Analysis copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Health Document Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-upload">Upload Document (Text File)</Label>
                <div className="mt-2">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload .txt file</span>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="document-text">Or Paste Document Text</Label>
                <Textarea
                  id="document-text"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste your medical document text here..."
                  rows={8}
                />
              </div>

              <Button 
                onClick={analyzeDocument} 
                disabled={isAnalyzing || !documentText.trim() || !documentType}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>AI Analysis Results</Label>
                {analysis && (
                  <Button variant="outline" size="sm" onClick={copyAnalysis}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
              
              <Card className="h-96">
                <CardContent className="p-4 h-full">
                  {analysis ? (
                    <div className="h-full overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {analysis}
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Upload or paste a medical document and click "Analyze Document" to see AI-powered insights
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important Disclaimer</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This AI analysis is for informational purposes only and should not be considered medical advice. 
                    Always consult with qualified healthcare professionals for medical interpretation, diagnosis, and treatment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentAnalyzer;