import { Button } from "@/components/ui/button"
import { Copy, Link2, Moon, RotateCcw, Sun, Github, CheckCircle2, Download } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import MarkdownRenderer from "@/components/common/MarkdownRenderer"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

function App() {
  const defaultMarkdown = `# Markdown Formatting Showcase

This document demonstrates all common Markdown formatting types, each under its own heading.

---

## Headings

### Heading Level Three
#### Heading Level Four
##### Heading Level Five
###### Heading Level Six

---

## Text Formatting

- **Bold text**
- *Italic text*
- ***Bold and Italic***
- ~~Strikethrough text~~

---

## Bullet Points

- Item One
- Item Two
  - Sub Item A
  - Sub Item B
- Item Three

---

## Numbered List

1. First Item
2. Second Item
   1. Sub Item 2.1
   2. Sub Item 2.2
3. Third Item

---

## Table

| Column One | Column Two | Column Three |
|------------|------------|--------------|
| Row 1A     | Row 1B     | Row 1C       |
| Row 2A     | Row 2B     | Row 2C       |
| Row 3A     | Row 3B     | Row 3C       |

---

## Code Snippet

### Inline Code
Use \`console.log()\` to print output in JavaScript.

### Code Block
\`\`\`python
def greet(name):
    print("Hello, " + name + "!")

greet("Markdown")

\`\`\`

---

## Image

![Markdown Placeholder Image](/markdown-mark.svg)

---

## Blockquote

> This is a blockquote example.  
> It is often used for notes or highlighted content.

---

## Horizontal Rule

---

## Links

[Markdown Official Guide](https://www.markdownguide.org)
`;

  const [markdown, setMarkdown] = useState<string>(defaultMarkdown);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [syncScroll, setSyncScroll] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    setMarkdown(defaultMarkdown);
    setShowResetDialog(false);
  };

  const downloadAsMarkdown = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdown));
    element.setAttribute('download', 'markdown.md');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsPDF = () => {
    if (!previewRef.current) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow popups to download PDF');
      return;
    }

    const content = previewRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Markdown PDF</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #000;
              background: white;
              padding: 40px;
            }
            h1 { font-size: 2em; margin: 0.67em 0; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
            h2 { font-size: 1.5em; margin: 0.75em 0; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
            h3 { font-size: 1.25em; margin: 0.83em 0; }
            h4 { font-size: 1em; margin: 1em 0; }
            h5 { font-size: 0.875em; margin: 1.16em 0; }
            h6 { font-size: 0.75em; margin: 1.33em 0; color: #666; }
            p { margin: 1em 0; }
            ul, ol { margin: 1em 0; padding-left: 2em; }
            li { margin: 0.25em 0; }
            code { 
              background: #f5f5f5; 
              padding: 0.2em 0.4em; 
              border-radius: 3px; 
              font-family: 'Courier New', monospace;
              font-size: 0.9em;
            }
            pre { 
              background: #f5f5f5; 
              padding: 1em; 
              border-radius: 5px; 
              overflow-x: auto;
              margin: 1em 0;
            }
            pre code { 
              background: none; 
              padding: 0;
            }
            blockquote { 
              border-left: 4px solid #ddd; 
              padding-left: 1em; 
              margin: 1em 0;
              color: #666;
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 1em 0;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 0.5em; 
              text-align: left;
            }
            th { 
              background: #f5f5f5; 
              font-weight: bold;
            }
            hr { 
              border: none; 
              border-top: 1px solid #ddd; 
              margin: 2em 0;
            }
            a { 
              color: #0066cc; 
              text-decoration: none;
            }
            a:hover { 
              text-decoration: underline;
            }
            img { 
              max-width: 100%; 
              height: auto;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleGithubClick = () => {
    window.open('https://github.com/tnpaul/MarkdownPreviewer', '_blank');
  };

  const handleEditorScroll = () => {
    if (!syncScroll || !editorRef.current || !previewRef.current) return;
    
    const editor = editorRef.current;
    const preview = previewRef.current;
    
    const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      if (newPosition >= 5 && newPosition <= 95) {
        setDividerPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const renderLineNumbers = () => {
    const lines = markdown.split('\n');
    return lines.map((_, index) => (
      <div key={index} className="text-gray-400 text-right pr-2 select-none">
        {index + 1}
      </div>
    ));
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-0.5 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Markdown Previewer
        </h1>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1 h-7 px-2"
          >
            {showCopyFeedback ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                <span className="text-[11px] leading-none">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[11px] leading-none">Copy</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center justify-center gap-1 h-7 px-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px] leading-none">Reset</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-1 h-7 px-2"
              >
                <Download className="w-3 h-3" />
                <span className="text-[11px] leading-none">Download</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadAsMarkdown}>
                Download as Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadAsPDF}>
                Download as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={syncScroll ? "default" : "outline"}
            size="sm"
            onClick={() => setSyncScroll(!syncScroll)}
            className="flex items-center justify-center gap-1 h-7 px-2"
          >
            <Link2 className="w-3 h-3" />
            <span className="text-[11px] leading-none">Sync scroll</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center gap-1 h-7 px-2"
          >
            {isDarkMode ? (
              <Sun className="w-3 h-3" />
            ) : (
              <Moon className="w-3 h-3" />
            )}
            <span className="text-[11px] leading-none">
              {isDarkMode ? 'Light' : 'Dark'}
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGithubClick}
            className="h-7 w-7 rounded-full bg-black p-0 flex items-center justify-center hover:bg-black"
          >
            <Github className="h-3.5 w-3.5 text-white" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div 
        ref={containerRef}
        className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-gray-950"
      >
        {/* Left Pane - Editor */}
        <div 
          className="flex overflow-hidden"
          style={{ width: `${dividerPosition}%` }}
        >
          <div className="bg-gray-100 dark:bg-gray-800 overflow-y-auto text-sm font-mono py-4">
            {renderLineNumbers()}
          </div>
          
          <textarea
            ref={editorRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onScroll={handleEditorScroll}
            className="flex-1 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none overflow-y-auto"
            placeholder="Enter your markdown here..."
          />
        </div>

        {/* Divider */}
        <div
          className={`w-1 bg-gray-300 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 cursor-col-resize ${
            isDragging ? 'bg-blue-500 dark:bg-blue-600' : ''
          }`}
          onMouseDown={handleMouseDown}
        />

        {/* Right Pane - Preview */}
        <div 
          ref={previewRef}
          className="overflow-y-auto bg-white dark:bg-gray-900"
          style={{ width: `${100 - dividerPosition}%` }}
        >
          <div className="pt-0 py-6 pr-6">
            <MarkdownRenderer content={markdown} />
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogTitle>Reset Editor</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset the markdown? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReset} className="bg-red-600 hover:bg-red-700">
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}

export default App;