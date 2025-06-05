import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface BlogEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

const BlogEditor = ({ value, onChange, height = 500 }: BlogEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <Editor
      apiKey="your-tinymce-api-key-here" // Richiederemo questa API key
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={handleEditorChange}
      init={{
        height: height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
          'emoticons', 'template', 'paste', 'textcolor', 'colorpicker'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic underline strikethrough | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help | forecolor backcolor | ' +
          'link image media | table | code fullscreen preview',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; line-height: 1.6; }',
        branding: false,
        elementpath: false,
        statusbar: true,
        resize: true,
        paste_data_images: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        file_picker_callback: (callback, value, meta) => {
          // Implementazione per upload di immagini
          if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            
            input.addEventListener('change', (e: any) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  const id = 'blobid' + (new Date()).getTime();
                  const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = (reader.result as string).split(',')[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  callback(blobInfo.blobUri(), { title: file.name });
                });
                reader.readAsDataURL(file);
              }
            });
            
            input.click();
          }
        },
        setup: (editor) => {
          editor.on('change', () => {
            handleEditorChange(editor.getContent());
          });
        }
      }}
    />
  );
};

export default BlogEditor;