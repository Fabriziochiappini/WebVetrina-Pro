import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Link, Image, Eye, Code 
} from 'lucide-react';

interface SimpleEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

const SimpleEditor = ({ value, onChange, height = 400 }: SimpleEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Ripristina il focus e la selezione
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleBold = () => insertText('**', '**');
  const handleItalic = () => insertText('*', '*');
  const handleUnderline = () => insertText('<u>', '</u>');
  const handleLink = () => {
    const url = prompt('Inserisci URL:');
    if (url) insertText(`[`, `](${url})`);
  };
  const handleImage = () => {
    const url = prompt('Inserisci URL immagine:');
    if (url) insertText(`![Immagine](${url})`);
  };
  const handleList = () => insertText('- ');
  const handleOrderedList = () => insertText('1. ');
  const handleCode = () => insertText('`', '`');

  const formatPreview = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Underline
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      // Code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      // Line breaks
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          title="Grassetto"
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          title="Corsivo"
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnderline}
          title="Sottolineato"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleList}
          title="Lista"
        >
          <List className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleOrderedList}
          title="Lista numerata"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLink}
          title="Link"
        >
          <Link className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImage}
          title="Immagine"
        >
          <Image className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCode}
          title="Codice"
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="flex-1"></div>
        
        <Button
          type="button"
          variant={isPreview ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          title="Anteprima"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor/Preview */}
      <div style={{ height: `${height}px` }}>
        {isPreview ? (
          <div 
            className="p-4 overflow-auto h-full prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatPreview(value) }}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Scrivi il contenuto del tuo articolo qui... 

Puoi usare:
# Titolo 1
## Titolo 2  
### Titolo 3
**grassetto** *corsivo*
- Lista
1. Lista numerata
[link](http://esempio.com)
![immagine](http://esempio.com/img.jpg)
`codice`"
            className="h-full resize-none border-0 rounded-none focus:ring-0"
            style={{ height: '100%' }}
          />
        )}
      </div>

      {/* Helper */}
      <div className="bg-gray-50 border-t border-gray-300 px-3 py-2 text-xs text-gray-600">
        {isPreview ? 'Modalità anteprima - clicca l\'occhio per tornare all\'editor' : 'Usa la toolbar o scrivi in Markdown. Clicca l\'occhio per l\'anteprima.'}
      </div>
    </div>
  );
};

export default SimpleEditor;