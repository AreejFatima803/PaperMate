/**
 * Examination Paper HTML Generator for PaperMate
 * Generates an official, print-ready, pixel-perfect BISE Board examination paper
 * with support for English & Urdu (Nastaleeq), Objective MCQs bubble grids,
 * Subjective sections, Roll number slips, and print-to-PDF styles.
 */

export function generatePaperHtml(paper) {
  const isUrdu = paper.isUrduPaper || paper.isTarjumaQuranPaper || paper.isIslamiatPaper;
  const isBilingual = !paper.isUrduPaper && !paper.isEnglishPaper;

  // 1. MCQs Section HTML
  let mcqHtml = '';
  if (paper.mcqSection?.active && paper.mcqSection.questions?.length > 0) {
    const isMcqUrdu = isUrdu || paper.mcqSection.questions.some(q => /[\u0600-\u06FF]/.test(q.questionText));
    mcqHtml = `
      <div class="paper-section ${isMcqUrdu ? 'rtl-sec' : ''}">
        <div class="section-banner">
          <span class="sec-title">${paper.mcqSection.title || 'PART - I (OBJECTIVE SECTION)'}</span>
          <span class="sec-marks">Marks: ${paper.mcqSection.marks} | Time: ${paper.mcqSection.time || '15-20 Min'}</span>
        </div>
        <div class="sec-note">
          ${isMcqUrdu
            ? 'نوٹ: ہر سوال کے چار ممکنہ جوابات (الف، ب، ج، د) دیے گئے ہیں۔ جوابی کاپی پر درست دائرے کو نیلے یا سیاہ مارکر سے بھریں۔'
            : 'Note: Each question has four possible options (A, B, C, D). Fill the appropriate circle on the answer sheet with blue/black ink.'}
        </div>
        <div class="mcq-grid">
          ${paper.mcqSection.questions.map((q, idx) => {
            const qUrdu = /[\u0600-\u06FF]/.test(q.questionText);
            const opts = q.options || [];
            return `
              <div class="mcq-item ${qUrdu ? 'rtl-text' : ''}">
                <div class="mcq-q">
                  <span class="q-badge">Q.1 (${idx + 1})</span>
                  <span class="q-text">${escapeHtml(q.questionText)}</span>
                </div>
                <div class="mcq-options ${qUrdu ? 'options-rtl' : ''}">
                  ${opts.map((opt, optIdx) => {
                    const label = qUrdu
                      ? ['الف', 'ب', 'ج', 'د'][optIdx] || `(${optIdx + 1})`
                      : String.fromCharCode(65 + optIdx);
                    return `
                      <div class="mcq-opt">
                        <span class="opt-bubble">(${label})</span>
                        <span class="opt-val">${escapeHtml(opt)}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // 2. Short Sections (Science, Math, English, General, Islamiat)
  let shortSectionsHtml = '';
  if (paper.shortSections && paper.shortSections.length > 0) {
    shortSectionsHtml = paper.shortSections.map((sec) => {
      const secUrdu = isUrdu || /[\u0600-\u06FF]/.test(sec.instruction || sec.title);
      return `
        <div class="paper-section ${secUrdu ? 'rtl-sec' : ''}">
          <div class="section-banner">
            <span class="sec-title">${sec.title}</span>
            <span class="sec-marks">${sec.totalMarks ? `[${sec.totalMarks} Marks]` : ''}</span>
          </div>
          <div class="sec-instruction ${secUrdu ? 'rtl-text' : ''}">${escapeHtml(sec.instruction || '')}</div>
          <div class="short-questions-list">
            ${(sec.questions || []).map((q, idx) => {
              const num = q.num || `(${idx + 1})`;
              const qUrdu = /[\u0600-\u06FF]/.test(q.text);
              return `
                <div class="short-q-row ${qUrdu ? 'rtl-text' : ''}">
                  <span class="short-q-num">${num}</span>
                  <div class="short-q-body">${escapeHtml(q.text).replace(/\n/g, '<br/>')}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. Urdu Specific Sections
  let urduSectionsHtml = '';
  if (paper.urduTashreehSection?.active) {
    const s = paper.urduTashreehSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        ${s.nazmVerses ? `
          <div class="sub-block">
            <div class="sub-title">الف- حصہ نظم (${s.nazmMarks || 'نمبر'})</div>
            ${s.nazmVerses.map(v => `<div class="verse-line rtl-text">${escapeHtml(v)}</div>`).join('')}
          </div>
        ` : ''}
        ${s.ghazalVerses ? `
          <div class="sub-block">
            <div class="sub-title">ب- حصہ غزل (${s.ghazalMarks || 'نمبر'})</div>
            ${s.ghazalVerses.map(v => `<div class="verse-line rtl-text">${escapeHtml(v)}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  if (paper.urduNasrSection?.active) {
    const s = paper.urduNasrSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        ${(s.paras || []).map(p => `
          <div class="para-box rtl-text">
            <strong>${p.num}</strong> ${escapeHtml(p.text)}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (paper.urduShortSection?.active) {
    const s = paper.urduShortSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="short-questions-list">
          ${(s.questions || []).map(q => `
            <div class="short-q-row rtl-text">
              <span class="short-q-body">${escapeHtml(q)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (paper.urduKhulasaSection?.active) {
    const s = paper.urduKhulasaSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="options-pills rtl-text">
          ${(s.options || []).map(opt => `<span class="opt-pill">${escapeHtml(opt)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.urduNazmKhulasaSection?.active) {
    const s = paper.urduNazmKhulasaSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
      </div>
    `;
  }

  if (paper.urduInshaSection?.active) {
    const s = paper.urduInshaSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="essay-topics rtl-text">
          ${(s.topics || []).map(t => `<div class="topic-item">• ${escapeHtml(t)}</div>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.urduKhatSection?.active) {
    const s = paper.urduKhatSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
      </div>
    `;
  }

  if (paper.urduKahaniSection?.active) {
    const s = paper.urduKahaniSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
      </div>
    `;
  }

  if (paper.urduJumlaySection?.active) {
    const s = paper.urduJumlaySection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="short-questions-list">
          ${(s.sentences || []).map(s => `<div class="short-q-row rtl-text"><span class="short-q-body">${escapeHtml(s)}</span></div>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.urduTalkheesSection?.active) {
    const s = paper.urduTalkheesSection;
    urduSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        ${s.passage ? `<div class="para-box rtl-text">${escapeHtml(s.passage)}</div>` : ''}
        ${s.questions ? `
          <div class="short-questions-list">
            ${s.questions.map(q => `<div class="short-q-row rtl-text"><span class="short-q-body">${escapeHtml(q)}</span></div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // 4. English Specific Sections
  let engSectionsHtml = '';
  if (paper.engTranslationSection?.active) {
    const s = paper.engTranslationSection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '')}</div>
        ${(s.paragraphs || []).map(p => `
          <div class="para-box"><strong>${p.tag}</strong> ${escapeHtml(p.text)}</div>
        `).join('')}
        ${s.altNote ? `<div class="sec-note">${escapeHtml(s.altNote).replace(/\n/g, '<br/>')}</div>` : ''}
      </div>
    `;
  }

  if (paper.engPoemSection?.active) {
    const s = paper.engPoemSection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '').replace(/\n/g, '<br/>')}</div>
        ${s.stanzaOption ? `<div class="verse-stanza">${escapeHtml(s.stanzaOption).replace(/\n/g, '<br/>')}</div>` : ''}
      </div>
    `;
  }

  if (paper.engEssaySection?.active) {
    const s = paper.engEssaySection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '')}</div>
        <div class="essay-topics">
          ${(s.topics || []).map(t => `<div class="topic-item">• ${escapeHtml(t)}</div>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.engNarrationSection?.active) {
    const s = paper.engNarrationSection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '')}</div>
        <div class="short-questions-list">
          ${(s.sentences || []).map(sent => `<div class="short-q-row"><span class="short-q-body">${escapeHtml(sent)}</span></div>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.engPairOfWordsSection?.active) {
    const s = paper.engPairOfWordsSection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '')}</div>
        <div class="pairs-grid">
          ${(s.pairs || []).map(pair => `<span class="pair-chip">${escapeHtml(pair)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.engLetterSection?.active) {
    const s = paper.engLetterSection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '').replace(/\n/g, '<br/>')}</div>
        ${s.options ? `
          <div class="essay-topics">
            ${s.options.map(opt => `<div class="topic-item">${escapeHtml(opt)}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  if (paper.engStorySection?.active) {
    const s = paper.engStorySection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '').replace(/\n/g, '<br/>')}</div>
      </div>
    `;
  }

  if (paper.engComprehensionSection?.active) {
    const s = paper.engComprehensionSection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '')}</div>
        <div class="para-box">${escapeHtml(s.passage || '')}</div>
        <div class="short-questions-list">
          ${(s.questions || []).map(q => `<div class="short-q-row"><span class="short-q-body">${escapeHtml(q)}</span></div>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.engUrduToEngSection?.active) {
    const s = paper.engUrduToEngSection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '')}</div>
        ${s.sentences ? `
          <div class="short-questions-list">
            ${s.sentences.map(sent => `<div class="short-q-row rtl-text"><span class="short-q-body">${escapeHtml(sent)}</span></div>`).join('')}
          </div>
        ` : ''}
        ${s.altForForeign ? `<div class="sec-note">${escapeHtml(s.altForForeign).replace(/\n/g, '<br/>')}</div>` : ''}
      </div>
    `;
  }

  if (paper.engVoiceSection?.active) {
    const s = paper.engVoiceSection;
    engSectionsHtml += `
      <div class="paper-section">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} Marks]</span>
        </div>
        <div class="sec-instruction">${escapeHtml(s.instruction || '')}</div>
        <div class="short-questions-list">
          ${(s.sentences || []).map(sent => `<div class="short-q-row"><span class="short-q-body">${escapeHtml(sent)}</span></div>`).join('')}
        </div>
      </div>
    `;
  }

  // 5. Tarjuma-tul-Quran & Islamiat Sections
  let islamicSectionsHtml = '';
  if (paper.tqShortSection?.active) {
    const s = paper.tqShortSection;
    islamicSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="short-questions-list">
          ${(s.questions || []).map(q => `<div class="short-q-row rtl-text"><span class="short-q-body">${escapeHtml(q)}</span></div>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.tqWordsSection?.active) {
    const s = paper.tqWordsSection;
    islamicSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="words-grid rtl-text">
          ${(s.words || []).map(w => `
            <div class="word-card">
              <span class="arabic-word">${escapeHtml(w.arabic)}</span>
              <span class="word-sep">=</span>
              <span class="urdu-meaning">${escapeHtml(w.meaning)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (paper.tqAyatSection?.active) {
    const s = paper.tqAyatSection;
    islamicSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="ayat-list rtl-text">
          ${(s.ayat || []).map(a => `<div class="ayah-item arabic-text">${escapeHtml(a)}</div>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.tqLongSection?.active) {
    const s = paper.tqLongSection;
    islamicSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="options-pills rtl-text">
          ${(s.options || []).map(opt => `<div class="topic-item">${escapeHtml(opt)}</div>`).join('')}
        </div>
      </div>
    `;
  }

  if (paper.islHadithSection?.active) {
    const s = paper.islHadithSection;
    islamicSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="hadith-box rtl-text">
          <div class="hadith-matn arabic-text">${escapeHtml(s.hadithText || '')}</div>
          <div class="hadith-tarjuma">${escapeHtml(s.translation || '')}</div>
        </div>
      </div>
    `;
  }

  if (paper.islLongSection?.active) {
    const s = paper.islLongSection;
    islamicSectionsHtml += `
      <div class="paper-section rtl-sec">
        <div class="section-banner">
          <span class="sec-title">${s.title}</span>
          <span class="sec-marks">[${s.marks} نمبر]</span>
        </div>
        <div class="sec-instruction rtl-text">${escapeHtml(s.instruction || '')}</div>
        <div class="options-pills rtl-text">
          ${(s.options || []).map(opt => `<div class="topic-item">${escapeHtml(opt)}</div>`).join('')}
        </div>
      </div>
    `;
  }

  // 6. Long Questions Section (Science, Math, Arts, Computer)
  let longSectionHtml = '';
  if (paper.longSection?.active && paper.longSection.questions?.length > 0) {
    const s = paper.longSection;
    const isLongUrdu = isUrdu || s.questions.some(q => /[\u0600-\u06FF]/.test(q.text));
    longSectionHtml = `
      <div class="paper-section ${isLongUrdu ? 'rtl-sec' : ''}">
        <div class="section-banner">
          <span class="sec-title">${s.title || 'PART - II (LONG QUESTIONS)'}</span>
          <span class="sec-marks">${s.marks ? `[Total Marks: ${s.marks}]` : ''}</span>
        </div>
        <div class="sec-instruction ${isLongUrdu ? 'rtl-text' : ''}">${escapeHtml(s.instruction || '')}</div>
        <div class="long-questions-list">
          ${s.questions.map((q) => {
            const num = q.num ? `Q.${q.num}` : '';
            const marks = q.marks ? `(${q.marks} Marks)` : '';
            const qUrdu = /[\u0600-\u06FF]/.test(q.text);
            return `
              <div class="long-q-block ${qUrdu ? 'rtl-text' : ''}">
                <div class="long-q-header">
                  <span class="q-badge">${num}</span>
                  <span class="long-marks">${marks}</span>
                </div>
                <div class="long-q-text">${escapeHtml(q.text).replace(/\n/g, '<br/>')}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Full HTML assembly
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(paper.institutionName || 'Examination Paper')} - ${escapeHtml(paper.subjectName)}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <style>
    /* Reset & Base Fonts */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Times New Roman', 'Calibri', 'Inter', -apple-system, sans-serif;
      background-color: #f1f5f9;
      color: #1e293b;
      line-height: 1.5;
      padding: 20px;
    }

    /* Print toolbar at top */
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #0f172a;
      color: #fff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-radius: 8px;
      margin-bottom: 24px;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
    .toolbar-info {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .toolbar-btns {
      display: flex;
      gap: 12px;
    }
    .btn-action {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .btn-action:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #475569;
    }
    .btn-secondary:hover {
      background: #334155;
    }

    /* Paper Page Container */
    .paper-page {
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
      padding: 28px 36px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      border: 3px double #0f172a;
      position: relative;
    }

    /* Watermark */
    .paper-page::before {
      content: "PAPERMATE • BISE 2026";
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 58px;
      font-weight: 900;
      color: rgba(15, 23, 42, 0.035);
      pointer-events: none;
      white-space: nowrap;
      z-index: 0;
      letter-spacing: 8px;
    }

    /* RTL Support */
    .rtl-sec, .rtl-text {
      direction: rtl;
      text-align: right;
      font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Tahoma', serif;
    }
    .arabic-text {
      font-family: 'Traditional Arabic', 'Scheherazade', 'Amiri', 'Tahoma', serif;
      font-size: 17px;
      font-weight: bold;
      line-height: 2;
    }

    /* Paper Header */
    .paper-header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 14px;
      position: relative;
      z-index: 1;
    }
    .inst-name {
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0f172a;
    }
    .board-name {
      font-size: 15px;
      font-weight: 700;
      color: #334155;
      margin-top: 2px;
    }
    .session-badge {
      display: inline-block;
      margin-top: 6px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 2px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.8px;
      color: #0f172a;
    }

    /* Meta Table */
    .meta-table {
      width: 100%;
      margin-top: 10px;
      border-collapse: collapse;
      font-size: 13px;
    }
    .meta-table td {
      padding: 4px 6px;
      vertical-align: middle;
    }
    .meta-label {
      font-weight: 800;
      color: #0f172a;
    }
    .name-line {
      display: inline-block;
      width: 175px;
      border-bottom: 1.5px solid #0f172a;
      margin-left: 6px;
      vertical-align: bottom;
      height: 16px;
    }
    .roll-box-wrap {
      text-align: right;
    }
    .roll-box {
      display: inline-flex;
      align-items: center;
      border: 1.5px solid #0f172a;
      padding: 2px 8px;
      background: #fafafa;
    }
    .roll-cell {
      display: inline-block;
      width: 18px;
      height: 20px;
      border: 1px solid #94a3b8;
      margin-left: 2px;
      text-align: center;
      background: #fff;
    }

    /* Sections */
    .paper-section {
      margin-top: 14px;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 14px;
      position: relative;
      z-index: 1;
      page-break-inside: auto;
      break-inside: auto;
    }
    .paper-section:last-of-type {
      border-bottom: none;
    }
    .section-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #fff;
      padding: 4px 12px;
      border-radius: 3px;
      margin-bottom: 8px;
      page-break-after: avoid;
      break-after: avoid;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .sec-title {
      font-weight: 800;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sec-marks {
      font-weight: 700;
      font-size: 12px;
      background: rgba(255, 255, 255, 0.2);
      padding: 1px 8px;
      border-radius: 2px;
    }
    .sec-instruction {
      font-size: 12.5px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
      line-height: 1.4;
      page-break-after: avoid;
      break-after: avoid;
    }
    .sec-note {
      font-size: 11.5px;
      font-style: italic;
      color: #475569;
      margin-bottom: 8px;
      page-break-after: avoid;
      break-after: avoid;
    }

    /* MCQs */
    .mcq-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .mcq-item {
      padding: 6px 8px;
      background: #fafafa;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .mcq-q {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }
    .q-badge {
      font-weight: 800;
      color: #2563eb;
      white-space: nowrap;
    }
    .mcq-options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-top: 6px;
      padding-left: 20px;
    }
    .options-rtl {
      padding-left: 0;
      padding-right: 20px;
    }
    .mcq-opt {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
    }
    .opt-bubble {
      font-weight: 800;
      color: #334155;
    }
    .opt-val {
      color: #1e293b;
    }

    /* Short Questions */
    .short-questions-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .short-q-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 13px;
      line-height: 1.45;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .short-q-num {
      font-weight: 800;
      color: #0f172a;
      min-width: 30px;
    }
    .short-q-body {
      flex: 1;
      color: #1e293b;
    }

    /* Long Questions */
    .long-questions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .long-q-block {
      background: #fafafa;
      border-left: 3px solid #2563eb;
      padding: 8px 12px;
      border-radius: 2px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .rtl-sec .long-q-block {
      border-left: none;
      border-right: 3px solid #2563eb;
    }
    .long-q-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .long-marks {
      font-size: 12px;
      font-weight: 700;
      color: #2563eb;
    }
    .long-q-text {
      font-size: 13px;
      line-height: 1.5;
    }

    /* Verses, Paragraphs, Chips */
    .sub-block {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .sub-title {
      font-weight: 800;
      font-size: 13px;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .verse-line {
      font-size: 14px;
      padding: 3px 0;
      color: #0f172a;
    }
    .para-box {
      background: #fafafa;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      margin: 6px 0;
      font-size: 13px;
      line-height: 1.6;
      border-radius: 4px;
    }
    .essay-topics {
      margin-top: 6px;
      font-size: 13px;
      line-height: 1.6;
    }
    .topic-item {
      padding: 2px 0;
      font-weight: 600;
    }
    .pairs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 6px;
      margin-top: 6px;
    }
    .pair-chip {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }
    .words-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 6px;
      margin-top: 6px;
    }
    .word-card {
      background: #fafafa;
      border: 1px solid #e2e8f0;
      padding: 4px 8px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }
    .arabic-word {
      font-family: 'Traditional Arabic', 'Amiri', serif;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }
    .hadith-box {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      padding: 10px 14px;
      border-radius: 4px;
      margin-top: 6px;
    }
    .hadith-matn {
      margin-bottom: 6px;
      color: #0f172a;
    }
    .hadith-tarjuma {
      font-size: 13px;
      color: #334155;
      font-weight: 600;
    }

    /* Paper Footer */
    .paper-footer {
      margin-top: 24px;
      border-top: 1.5px solid #0f172a;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11px;
      font-weight: 700;
      color: #475569;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      width: 170px;
      text-align: center;
      padding-top: 4px;
      font-size: 11px;
      color: #0f172a;
    }
    .footer-center {
      text-align: center;
      font-size: 11px;
      letter-spacing: 0.5px;
      color: #0f172a;
    }

    /* Print Media Queries */
    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print, .print-toolbar {
        display: none !important;
      }
      .paper-page {
        max-width: 100% !important;
        box-shadow: none !important;
        border: 2px solid #000 !important;
        padding: 8mm 10mm !important;
        margin: 0 !important;
      }
      .paper-header {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .paper-section {
        page-break-inside: auto !important;
        break-inside: auto !important;
      }
      .mcq-item, .short-q-row, .long-q-block, .para-box, .sub-block {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .section-banner, .sec-instruction, .sec-note {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .paper-footer {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      @page {
        size: A4;
        margin: 6mm 8mm;
      }
    }
  </style>
</head>
<body>
  <div class="print-toolbar no-print">
    <div class="toolbar-info">
      📄 ${escapeHtml(paper.subjectName)} Examination Paper (${escapeHtml(paper.className)})
    </div>
    <div class="toolbar-btns">
      <button class="btn-action" style="background:#16a34a;" onclick="downloadAsPdf(this)">
        📥 Download PDF (.pdf)
      </button>
      <button class="btn-action" style="background:#0284c7;" onclick="sharePdf(this)">
        📤 Share PDF
      </button>
      <button class="btn-action" onclick="window.print()">
        🖨️ Print / Save as PDF
      </button>
      <button class="btn-action btn-secondary" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </div>

  <div class="paper-page">
    <!-- Header Block -->
    <div class="paper-header">
      <div class="inst-name">${escapeHtml(paper.institutionName || 'THE HOPE TEST SERIES')}</div>
      <div class="board-name">${escapeHtml(paper.boardName || 'Board of Intermediate and Secondary Education')}</div>
      <div class="session-badge">ANNUAL EXAMINATION 2026 • ${escapeHtml((paper.syllabusScope || 'Full Book').toUpperCase())}</div>

      <table class="meta-table">
        <tr>
          <td style="width: 44%;"><span class="meta-label">Student Name:</span> <span class="name-line"></span></td>
          <td style="width: 26%;"><span class="meta-label">Class:</span> ${escapeHtml(paper.className || '')}</td>
          <td class="roll-box-wrap" rowspan="2" style="width: 30%;">
            <div class="roll-box">
              <span class="meta-label">Roll No:</span>
              <span class="roll-cell"></span>
              <span class="roll-cell"></span>
              <span class="roll-cell"></span>
              <span class="roll-cell"></span>
              <span class="roll-cell"></span>
              <span class="roll-cell"></span>
            </div>
          </td>
        </tr>
        <tr>
          <td><span class="meta-label">Subject:</span> ${escapeHtml(paper.subjectName || '')} ${paper.subjectNameUrdu ? `(${escapeHtml(paper.subjectNameUrdu)})` : ''}</td>
          <td><span class="meta-label">Total Marks:</span> ${escapeHtml(String(paper.totalMarks || ''))} &nbsp;|&nbsp; <span class="meta-label">Time:</span> ${escapeHtml(paper.timeAllowed || '')}</td>
        </tr>
      </table>
    </div>

    <!-- Sections Content -->
    ${mcqHtml}
    ${shortSectionsHtml}
    ${urduSectionsHtml}
    ${engSectionsHtml}
    ${islamicSectionsHtml}
    ${longSectionHtml}

    <!-- Official Paper Footer -->
    <div class="paper-footer">
      <div class="sig-line">Invigilator's Signature</div>
      <div class="footer-center">
        ★ BEST OF LUCK FOR EXAMINATION 2026 ★<br/>
        <small style="color: #64748b;">Printed via PaperMate Automated Examination System</small>
      </div>
      <div class="sig-line">Superintendent's Signature</div>
    </div>
  </div>

  <script>
    function getPdfOptions() {
      var filename = '${(paper.subjectName || 'Exam').replace(/\s+/g, '_')}_${(paper.className || 'Paper').replace(/\s+/g, '_')}_2026.pdf';
      return {
        margin: [6, 8, 6, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };
    }

    function downloadAsPdf(btn) {
      var origText = btn ? btn.innerText : '';
      if (btn) btn.innerText = '⏳ Generating PDF...';
      var element = document.querySelector('.paper-page');
      if (window.html2pdf) {
        window.html2pdf().set(getPdfOptions()).from(element).save().then(function() {
          if (btn) btn.innerText = origText;
        }).catch(function(e) {
          if (btn) btn.innerText = origText;
          window.print();
        });
      } else {
        if (btn) btn.innerText = origText;
        window.print();
      }
    }

    async function sharePdf(btn) {
      var origText = btn ? btn.innerText : '';
      if (btn) btn.innerText = '⏳ Preparing PDF...';
      var element = document.querySelector('.paper-page');
      var filename = '${(paper.subjectName || 'Exam').replace(/\s+/g, '_')}_${(paper.className || 'Paper').replace(/\s+/g, '_')}_2026.pdf';
      if (window.html2pdf) {
        try {
          var worker = window.html2pdf().set(getPdfOptions()).from(element);
          var pdfBlob = await worker.output('blob');
          if (pdfBlob && navigator.canShare) {
            var file = new File([pdfBlob], filename, { type: 'application/pdf' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: '${escapeHtml(paper.subjectName)} Paper 2026',
                text: 'Official Examination Paper (PDF Format)',
                files: [file]
              });
              if (btn) btn.innerText = origText;
              return;
            }
          }
        } catch(e) {
          console.warn('Share error', e);
        }
      }
      if (btn) btn.innerText = origText;
      downloadAsPdf(btn);
    }
  </script>
</body>
</html>`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
