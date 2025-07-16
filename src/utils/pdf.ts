import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TestResult, UserProfile } from '../types';
import { getCEFRInfo } from './cefr';

export const generateResultsPDF = async (result: TestResult, user: UserProfile) => {
  const pdf = new jsPDF();
  const cefrInfo = getCEFRInfo(result.cefrLevel);

  // Add title
  pdf.setFontSize(20);
  pdf.setTextColor(59, 130, 246);
  pdf.text('CEFR Speaking Assessment Report', 20, 30);

  // Add user info
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${user.name}`, 20, 50);
  pdf.text(`Date: ${result.completedAt.toLocaleDateString()}`, 20, 60);
  pdf.text(`Duration: ${Math.floor(result.duration / 60)} minutes`, 20, 70);

  // Add CEFR level
  pdf.setFontSize(16);
  pdf.setTextColor(59, 130, 246);
  pdf.text(`CEFR Level: ${result.cefrLevel}`, 20, 90);
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Overall Score: ${result.overallScore.toFixed(1)}/6.0`, 20, 105);

  // Add subskills
  pdf.text('Subskill Breakdown:', 20, 125);
  pdf.text(`Fluency: ${result.subskills.fluency.toFixed(1)}`, 30, 140);
  pdf.text(`Grammar: ${result.subskills.grammar.toFixed(1)}`, 30, 150);
  pdf.text(`Vocabulary: ${result.subskills.vocabulary.toFixed(1)}`, 30, 160);
  pdf.text(`Coherence: ${result.subskills.coherence.toFixed(1)}`, 30, 170);
  pdf.text(`Pronunciation: ${result.subskills.pronunciation.toFixed(1)}`, 30, 180);

  // Add feedback
  pdf.text('Feedback:', 20, 200);
  const splitFeedback = pdf.splitTextToSize(result.feedback, 170);
  pdf.text(splitFeedback, 20, 215);

  // Save the PDF
  pdf.save(`CEFR_Report_${result.cefrLevel}_${result.completedAt.toLocaleDateString()}.pdf`);
};

export const generateCertificatePDF = async (user: UserProfile, cefrLevel: string) => {
  const certificateElement = document.getElementById('certificate-content');
  if (!certificateElement) return;

  const canvas = await html2canvas(certificateElement, {
    scale: 2,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`CEFR_Certificate_${cefrLevel}_${user.name}.pdf`);
};