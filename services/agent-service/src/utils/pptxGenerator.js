import pptxgen from 'pptxgenjs';

/**
 * Generates a PowerPoint presentation from JSON slide structure.
 * Structure:
 * [
 *   {
 *     slide_number: 1,
 *     title: "Introduction",
 *     bullet_points: ["Point 1", "Point 2", "Point 3"],
 *     speaker_notes: "Welcome everyone..."
 *   }
 * ]
 */
export const generatePptxBuffer = async (slides, deckTitle = 'Cortex Presentation') => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Cortex Multi-Agent AI';
  pptx.title = deckTitle;

  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: '0F172A' }; // Dark slate
  titleSlide.addText(deckTitle, {
    x: 0.8,
    y: 2.2,
    w: 8.4,
    h: 1.5,
    fontSize: 36,
    bold: true,
    color: '38BDF8', // Cyan/Sky blue
    align: 'left',
  });
  titleSlide.addText('Generated with Cortex Multi-Agent AI Platform', {
    x: 0.8,
    y: 3.8,
    w: 8.4,
    h: 0.8,
    fontSize: 16,
    color: '94A3B8',
    align: 'left',
  });

  // Content Slides
  slides.forEach((slideData) => {
    const slide = pptx.addSlide();
    slide.background = { color: '0B0F19' }; // Deep dark

    // Slide Header / Title
    slide.addText(slideData.title || `Slide ${slideData.slide_number}`, {
      x: 0.8,
      y: 0.6,
      w: 8.4,
      h: 0.9,
      fontSize: 26,
      bold: true,
      color: 'F8FAFC',
    });

    // Accent line under title
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 0.04,
      fill: { color: '38BDF8' },
    });

    // Bullet points
    const bulletItems = (slideData.bullet_points || []).map((pt) => ({
      text: `  •  ${pt}`,
      options: { fontSize: 16, color: 'E2E8F0', breakLine: true },
    }));

    if (bulletItems.length > 0) {
      slide.addText(bulletItems, {
        x: 0.8,
        y: 1.9,
        w: 8.4,
        h: 3.2,
        bullet: false,
        margin: 0.1,
        lineSpacing: 28,
      });
    }

    // Slide number footer
    slide.addText(`${slideData.slide_number || ''}`, {
      x: 8.5,
      y: 5.0,
      w: 0.8,
      h: 0.4,
      fontSize: 11,
      color: '64748B',
      align: 'right',
    });

    // Speaker notes
    if (slideData.speaker_notes) {
      slide.addNotes(slideData.speaker_notes);
    }
  });

  // Export buffer
  const buffer = await pptx.write({ outputType: 'nodebuffer' });
  return buffer;
};
