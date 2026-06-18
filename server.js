const express = require('express');
const Groq = require('groq-sdk');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const knowledgeBase = [
  {
    id: 'overview',
    title: 'Taipei Medical University — Overview',
    content: `Taipei Medical University (TMU) was founded in 1960 by Dr. Hu Shui-Yuan and was originally named Taipei Medical College. It is a private medical research university located in Xinyi District, Taipei, Taiwan. TMU is one of Taiwan's leading health sciences universities, dedicated to training healthcare professionals and advancing biomedical research. The university's mission is to cultivate medical talent and enhance societal health. TMU comprises multiple colleges, research centers, and affiliated teaching hospitals. The university is internationally accredited and holds strong partnerships with universities and institutions worldwide. Its motto reflects excellence in medicine, research, and service to humanity.`
  },
  {
    id: 'college_medicine',
    title: 'College of Medicine',
    content: `The College of Medicine at Taipei Medical University is the founding and flagship college of the university. It offers a six-year undergraduate Medicine (MD) program. The college trains highly skilled physicians and medical researchers through departments including Internal Medicine, Surgery, Pediatrics, Obstetrics and Gynecology, Psychiatry, Neurology, Dermatology, Ophthalmology, Radiology, and Anesthesiology. The college emphasizes clinical training, medical ethics, and biomedical research. Students gain extensive clinical experience through rotations at TMU's affiliated hospitals. Graduate programs include Master's and PhD degrees in various medical specializations.`
  },
  {
    id: 'college_oral_medicine',
    title: 'College of Oral Medicine',
    content: `The College of Oral Medicine at Taipei Medical University offers a six-year dentistry program leading to a Doctor of Dental Medicine (DMD) degree. The college includes the School of Dentistry and the Graduate Institute of Dental Sciences. Programs cover general dentistry, oral surgery, periodontics, orthodontics, prosthodontics, pediatric dentistry, and endodontics. The college has state-of-the-art dental laboratories and simulation centers. Clinical practice is conducted at affiliated dental clinics within TMU's hospital system. Research focuses on dental materials science, oral biology, and clinical dentistry outcomes.`
  },
  {
    id: 'college_pharmacy',
    title: 'College of Pharmacy',
    content: `The College of Pharmacy at Taipei Medical University offers a four-year Bachelor of Pharmacy (B.Pharm) undergraduate degree along with Master's and PhD programs in pharmaceutical sciences. Key departments include the School of Pharmacy, Graduate Institute of Pharmacognosy, and Graduate Institute of Clinical Pharmacy. Research areas include drug development, natural products chemistry, pharmacokinetics, clinical pharmacy, and pharmaceutical biotechnology. Students receive training in drug dispensing, patient counseling, and pharmaceutical research. The college maintains modern pharmaceutical laboratories and active industry collaborations.`
  },
  {
    id: 'college_nursing',
    title: 'College of Nursing',
    content: `The College of Nursing at Taipei Medical University is one of Taiwan's leading nursing schools. It offers a four-year Bachelor of Science in Nursing (BSN) as well as Master's and PhD programs. The college prepares nurses for diverse healthcare settings including hospitals, community health centers, and public health agencies. Curriculum covers fundamental nursing skills, evidence-based practice, nursing informatics, geriatric nursing, psychiatric nursing, and nursing leadership. The college emphasizes holistic patient care, critical thinking, and clinical competence. Students complete clinical practicums at TMU's affiliated hospitals across Taipei and New Taipei City.`
  },
  {
    id: 'college_public_health',
    title: 'College of Public Health',
    content: `The College of Public Health at Taipei Medical University focuses on population health, preventive medicine, and health policy. Programs include a Bachelor of Public Health, Master of Public Health (MPH), and PhD in Public Health. Research areas include epidemiology, biostatistics, environmental health, health policy and management, global health, and occupational health. The college is active in national and international research projects on infectious disease prevention, chronic disease epidemiology, and health systems strengthening. Faculty collaborate with Taiwan's Centers for Disease Control, World Health Organization, and various international agencies.`
  },
  {
    id: 'college_biomedical',
    title: 'College of Biomedical Engineering',
    content: `The College of Biomedical Engineering at Taipei Medical University trains engineers and scientists at the intersection of medicine and technology. Programs include a Bachelor of Biomedical Engineering and Master's and PhD programs. Research areas cover biomedical devices, medical imaging, bioinformatics, tissue engineering, and neural engineering. The college collaborates closely with clinical departments to develop innovative medical technologies. Research projects include wearable health monitors, AI-assisted diagnostics, medical robotics, nanomedicine, and regenerative medicine. Students receive interdisciplinary training combining engineering fundamentals with biomedical sciences and clinical exposure.`
  },
  {
    id: 'college_health_admin',
    title: 'College of Health Care Administration',
    content: `The College of Health Care Administration at Taipei Medical University prepares healthcare managers and policy professionals. Programs include a Bachelor of Healthcare Management, Master of Health Administration (MHA), and an Executive MBA in Health Care Management. Curriculum covers hospital administration, health economics, health informatics, quality management, healthcare law, and strategic planning. Graduates work in hospitals, clinics, insurance companies, government health agencies, and consulting firms. The college has strong industry partnerships and provides practical training through internships and real-world case studies.`
  },
  {
    id: 'tmu_hospital',
    title: 'Taipei Medical University Hospital (TMUH)',
    content: `Taipei Medical University Hospital (TMUH) is the primary teaching hospital of Taipei Medical University, located adjacent to the main campus in Xinyi District, Taipei. It is a comprehensive medical center providing tertiary care across all major specialties. TMUH is designated a medical center by Taiwan's Ministry of Health and Welfare, the highest hospital accreditation tier in Taiwan. The hospital operates specialized centers including the Cancer Center, Heart Center, Kidney Center, Neuroscience Center, and Reproductive Medicine Center. TMUH conducts translational research connecting laboratory discoveries to clinical applications and serves hundreds of thousands of patients annually.`
  },
  {
    id: 'wanfang_hospital',
    title: 'Wan Fang Hospital',
    content: `Wan Fang Hospital is one of Taipei Medical University's major affiliated teaching hospitals, located in Wenshan District, Taipei. It serves as a regional medical center for the southern Taipei metropolitan area. Wan Fang Hospital provides comprehensive inpatient and outpatient services across all major specialties including internal medicine, surgery, pediatrics, obstetrics and gynecology, and orthopedics. The hospital is an important clinical training site for TMU students. It actively participates in medical research and community health programs. Wan Fang Hospital has received high accreditation ratings for quality patient care and safety.`
  },
  {
    id: 'shuangho_hospital',
    title: 'Shuang Ho Hospital',
    content: `Shuang Ho Hospital, Taipei Medical University is a major affiliated teaching hospital located in Zhonghe District, New Taipei City. It is one of the largest hospitals in the greater Taipei metropolitan area. Shuang Ho Hospital is a medical center-level institution offering comprehensive clinical services across all major medical specialties. The hospital is equipped with advanced medical technology and conducts substantial clinical research. It serves as a key clinical training site for TMU medical, nursing, and pharmacy students. Shuang Ho Hospital is recognized for its cardiovascular, oncology, transplant programs, and patient-centered quality care.`
  },
  {
    id: 'research',
    title: 'Research and Innovation at TMU',
    content: `Taipei Medical University is a research-intensive university with significant achievements in biomedical and health sciences. TMU has established research centers including the TMU Research Center of Cancer Translational Medicine, the Center for Translational Medicine, and the Neuroscience Research Center. The university regularly publishes research in high-impact international journals. TMU faculty receive funding from Taiwan's National Science and Technology Council (NSTC, formerly MOST), National Health Research Institutes, and international sources. Research priorities include cancer biology, drug development, precision medicine, medical informatics, aging, and global health. TMU participates in international research consortia and collaborates with leading universities worldwide.`
  },
  {
    id: 'international',
    title: 'International Programs at TMU',
    content: `Taipei Medical University maintains strong international programs and partnerships with hundreds of universities and institutions worldwide. TMU offers English-taught programs for international students in medicine, pharmacy, public health, and biomedical engineering. Exchange agreements span universities across Asia, Europe, North America, and Australia. International students benefit from high-quality medical education, cultural immersion in Taiwan, and clinical training at TMU's affiliated hospitals. TMU is a member of multiple international university networks and regularly hosts international biomedical conferences and symposia. The International Office provides comprehensive support services for international students and visiting faculty.`
  },
  {
    id: 'campus',
    title: 'TMU Campus and Facilities',
    content: `Taipei Medical University's main campus is located in Xinyi District, Taipei City, Taiwan. The campus features modern academic buildings, advanced research laboratories, simulation centers, and comprehensive student facilities. Key facilities include the TMU Library with extensive biomedical and health science collections, clinical simulation centers for medical and nursing training with high-fidelity mannequins, sports facilities including a gymnasium and athletic courts, student dormitories for domestic and international students, cafeterias and dining halls, a campus health center, and a student counseling center. The campus is conveniently accessible by the Taipei MRT (metro) system. TMU continuously expands and upgrades its facilities to support academic and research excellence.`
  },
  {
    id: 'admission',
    title: 'Admission to Taipei Medical University',
    content: `Admission to Taipei Medical University is competitive, reflecting the university's high academic standards. Domestic undergraduate applicants apply through Taiwan's university placement system using the General Scholastic Ability Test (GSAT) and the Advanced Subjects Test (AST) administered by the College Entrance Examination Center. International students apply through TMU's international admissions process, which may require academic transcripts, language proficiency scores (TOEFL or IELTS for English programs), letters of recommendation, and a personal statement. Medical and dental programs have additional requirements including interviews. TMU offers scholarships for outstanding students including international scholarship programs. Prospective students should consult the official TMU website or admissions office for current requirements and application deadlines.`
  }
];

// ─── BM25 Retrieval ───────────────────────────────────────────────────────────
class BM25 {
  constructor(docs, k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.docs = docs;
    this.docFreq = {};
    this.docLengths = [];
    this.avgDocLength = 0;
    this.idf = {};
    this._buildIndex();
  }

  _tokenize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);
  }

  _buildIndex() {
    const N = this.docs.length;
    let totalLen = 0;

    this.docs.forEach((doc, i) => {
      const tokens = this._tokenize(doc.content + ' ' + doc.title);
      this.docLengths[i] = tokens.length;
      totalLen += tokens.length;

      const seen = new Set();
      tokens.forEach(t => {
        if (!seen.has(t)) {
          this.docFreq[t] = (this.docFreq[t] || 0) + 1;
          seen.add(t);
        }
      });
    });

    this.avgDocLength = totalLen / N;

    Object.keys(this.docFreq).forEach(term => {
      const df = this.docFreq[term];
      this.idf[term] = Math.log((N - df + 0.5) / (df + 0.5) + 1);
    });
  }

  search(query, topK = 3) {
    const queryTokens = this._tokenize(query);

    const scores = this.docs.map((doc, i) => {
      const tokens = this._tokenize(doc.content + ' ' + doc.title);
      const tf = {};
      tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });

      let score = 0;
      queryTokens.forEach(term => {
        if (this.idf[term] === undefined) return;
        const termTf = tf[term] || 0;
        const dl = this.docLengths[i];
        const norm = termTf * (this.k1 + 1) /
          (termTf + this.k1 * (1 - this.b + this.b * dl / this.avgDocLength));
        score += this.idf[term] * norm;
      });

      return { doc, score };
    });

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(s => s.score > 0)
      .map(s => s.doc);
  }
}

const bm25 = new BM25(knowledgeBase);

// ─── API Endpoint ─────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const retrieved = bm25.search(message.trim(), 3);

    const context = retrieved.length > 0
      ? retrieved.map(d => `[Source: ${d.title}]\n${d.content}`).join('\n\n---\n\n')
      : 'No relevant context found in the knowledge base.';

    const systemPrompt =
      `You are a helpful assistant for Taipei Medical University (TMU). ` +
      `Answer the user's question using ONLY the information in the context below. ` +
      `If the answer cannot be found in the context, say so clearly and suggest the user visit the official TMU website. ` +
      `Be concise, accurate, and helpful.\n\n` +
      `=== CONTEXT ===\n${context}\n=== END CONTEXT ===`;

    const completion = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message.trim() }
      ],
      max_tokens: 1024
    });
    const answer = completion.choices[0].message.content;

    res.json({
      answer,
      sources: retrieved.map(d => ({ id: d.id, title: d.title })),
      retrievedContext: retrieved.map(d => ({
        id: d.id,
        title: d.title,
        snippet: d.content.slice(0, 200) + (d.content.length > 200 ? '…' : '')
      }))
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TMU RAG Chatbot running on http://localhost:${PORT}`));
