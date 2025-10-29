
import { Presentation } from '../types';

declare const jspdf: any;
declare const html2canvas: any;

export const exportToPdf = async (presentation: Presentation) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1000, 1000 / (16 / 9)],
  });

  const slidesContainer = document.getElementById('slides-for-export');
  if (!slidesContainer) {
    console.error('Export container not found');
    return;
  }

  const originalSlides = Array.from(slidesContainer.children) as HTMLElement[];

  for (let i = 0; i < originalSlides.length; i++) {
    const slideElement = originalSlides[i];
    try {
      const canvas = await html2canvas(slideElement, {
        scale: 2, // Increase scale for better quality
        useCORS: true,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL('image/png');
      
      if (i > 0) {
        doc.addPage();
      }
      doc.addImage(imgData, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
    } catch (error) {
      console.error('Error capturing slide for PDF:', error);
    }
  }

  doc.save(`${presentation.title}.pdf`);
};


export const exportToJson = (presentation: Presentation) => {
  const dataStr = JSON.stringify(presentation, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `${presentation.title}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importFromJson = (file: File): Promise<Presentation> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const result = event.target?.result as string;
                const presentation = JSON.parse(result) as Presentation;
                // Basic validation
                if (presentation.title && Array.isArray(presentation.slides)) {
                    resolve(presentation);
                } else {
                    reject(new Error('Invalid presentation file format.'));
                }
            } catch (e) {
                reject(new Error('Failed to parse JSON file.'));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};
