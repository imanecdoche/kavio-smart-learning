import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Button from '../ui/Button';
import {
  InteractiveExampleList,
  VerbMorphingStep,
  SentenceConstructionStep,
  StatementStep,
} from './templates';

const layoutTransition = {
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1],
};

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 28 : -28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.85, 0, 0.15, 1],
    },
  },
  exit: (dir) => ({
    x: dir > 0 ? -28 : 28,
    opacity: 0,
    transition: {
      duration: 0.22,
      ease: [0.85, 0, 0.15, 1],
    },
  }),
};

// =============================================================================
// CURRICULUM DEFINITION (9 SLIDES STRICTLY ADHERING TO AGENTS.md & RULES.md)
// =============================================================================
const slidesData = [
  // ---------------------------------------------------------------------------
  // SLIDE 1: Apa itu Helper HAVE?
  // ---------------------------------------------------------------------------
  {
    slideNum: 1,
    title: 'Apa itu Helper HAVE?',
    subtitle: 'Memahami dua peran mendasar kata HAVE dalam bahasa Inggris.',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        columns: [
          {
            header: '1. KATA KERJA UTAMA (MAIN VERB)',
            headerColor: 'text-slate-400',
            title: 'Memiliki / Mempunyai',
            example: 'I have a car.',
            exampleColor: 'text-sky-400',
            note: 'HAVE berdiri sendiri tanpa kata kerja lain untuk menyatakan kepemilikan objek.',
          },
          {
            header: '2. KATA BANTU (HELPER VERB)',
            headerColor: 'text-amber-400',
            title: 'Sudah / Telah',
            example: 'I have eaten.',
            exampleColor: 'text-emerald-400',
            note: 'HAVE berpasangan dengan Verb-3 untuk menegaskan perbuatan sudah tuntas.',
          },
        ],
        explanation:
          'Perhatikan kontrasnya: saat berdiri sendiri tanpa kata kerja lain, HAVE bermakna "memiliki". Namun saat mendampingi Verb-3, ia bertransformasi menjadi kata bantu yang bermakna "sudah".',
      },
      {
        subStep: 2,
        columns: [
          {
            header: '1. KATA KERJA UTAMA (MAIN VERB)',
            headerColor: 'text-slate-400',
            title: 'Memiliki / Mempunyai',
            example: 'She has a book.',
            exampleColor: 'text-sky-400',
            note: 'Menyatakan kepemilikan benda secara langsung.',
          },
          {
            header: '2. KATA BANTU (HELPER VERB)',
            headerColor: 'text-amber-400',
            title: 'Sudah / Telah',
            example: 'She has arrived.',
            exampleColor: 'text-emerald-400',
            note: 'Fokus modul kita: Helper penegas aksi selesai dengan dampak terasa saat ini.',
          },
        ],
        explanation:
          'Fokus utama kita di modul ini adalah peran kedua: Helper HAVE yang bertugas mengawal Verb-3 untuk menyatakan aksi yang tuntas di masa kini (Present Perfect).',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 2: Peta 4 Helper Bahasa Inggris
  // ---------------------------------------------------------------------------
  {
    slideNum: 2,
    title: 'Peta 4 Helper Bahasa Inggris',
    subtitle: 'HAVE adalah helper keempat dan penutup pondasi tata bahasa A1-A2.',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        columns: [
          {
            header: '1. HELPER BE',
            headerColor: 'text-sky-400',
            status: 'SELESAI ✓',
            statusColor: 'text-sky-400/80',
            title: 'Sedang / Kondisi',
            example: 'is / am / are • was / were',
            exampleColor: 'text-sky-300',
            note: 'Menyatakan aksi yang sedang berlangsung atau kondisi/sifat subjek.',
          },
          {
            header: '2. HELPER DO',
            headerColor: 'text-emerald-400',
            status: 'SELESAI ✓',
            statusColor: 'text-emerald-400/80',
            title: 'Fakta & Rutinitas',
            example: 'do / does • did',
            exampleColor: 'text-emerald-300',
            note: 'Pondasi kalimat verbal sehari-hari untuk kebiasaan dan fakta.',
          },
          {
            header: '3. HELPER WILL',
            headerColor: 'text-blue-400',
            status: 'SELESAI ✓',
            statusColor: 'text-blue-400/80',
            title: 'Masa Depan',
            example: 'will',
            exampleColor: 'text-blue-300',
            note: 'Menyatakan rencana, prediksi, atau keputusan di masa depan.',
          },
          {
            header: '4. HELPER HAVE',
            headerColor: 'text-amber-400',
            status: 'FOKUS KITA',
            statusColor: 'text-amber-400 font-extrabold',
            title: 'Aksi Selesai (Perfect)',
            example: 'have / has • had',
            exampleColor: 'text-amber-300',
            note: 'Menyatakan aksi yang sudah tuntas dengan dampak terasa hingga kini.',
            highlight: true,
          },
        ],
        explanation:
          'Seluruh kalimat bahasa Inggris digerakkan oleh 4 keluarga Helper ini. Tiga keluarga pertama sudah kamu kuasai, dan kini Helper HAVE hadir sebagai puncak pemahaman tata bahasamu.',
      },
      {
        subStep: 2,
        columns: [
          {
            header: 'WAKTU BERJALAN',
            headerColor: 'text-sky-400',
            title: 'Continuous',
            example: 'They are playing.',
            exampleColor: 'text-sky-300',
            note: 'Aksi sedang terjadi saat ini di depan mata.',
          },
          {
            header: 'WAKTU BERULANG',
            headerColor: 'text-emerald-400',
            title: 'Simple Present',
            example: 'They play every day.',
            exampleColor: 'text-emerald-300',
            note: 'Rutinitas harian yang berulang secara berkala.',
          },
          {
            header: 'WAKTU MENDATANG',
            headerColor: 'text-blue-400',
            title: 'Simple Future',
            example: 'They will play tomorrow.',
            exampleColor: 'text-blue-300',
            note: 'Aksi prospektif yang akan terjadi di masa depan.',
          },
          {
            header: 'WAKTU TUNTAS',
            headerColor: 'text-amber-400',
            title: 'Present Perfect',
            example: 'They have played.',
            exampleColor: 'text-amber-300',
            note: 'Aksi telah tuntas dengan hasil nyata saat ini.',
            highlight: true,
          },
        ],
        explanation:
          'Kini matriks waktumu lengkap: dari apa yang sedang berjalan (BE), kebiasaan umum (DO), rencana depan (WILL), hingga apa yang sudah tuntas kamu selesaikan (HAVE).',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 3: Bentuk-Bentuk Helper HAVE
  // ---------------------------------------------------------------------------
  {
    slideNum: 3,
    title: 'Bentuk-Bentuk Helper HAVE',
    subtitle: 'Pembagian bentuk HAVE di masa sekarang (Present) dan masa lalu (Past).',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        columns: [
          {
            header: 'PRESENT (MASA KINI)',
            headerColor: 'text-sky-400',
            title: 'HAVE / HAS',
            example: 'I have • She has',
            exampleColor: 'text-sky-300',
            note: 'HAVE untuk I, You, We, They, & jamak. HAS untuk He, She, It, & tunggal.',
          },
          {
            header: 'PAST (MASA LAMPAU)',
            headerColor: 'text-amber-400',
            title: 'HAD',
            example: 'I had • She had',
            exampleColor: 'text-amber-300',
            note: 'HAD bersifat universal untuk semua subjek tanpa terkecuali.',
          },
        ],
        explanation:
          'Di masa sekarang (Present): gunakan HAVE atau HAS tergantung subjek. Sedangkan di masa lampau (Past): bentuknya seragam menjadi HAD untuk SEMUA subjek.',
      },
      {
        subStep: 2,
        columns: [
          {
            header: 'PRESENT PERFECT',
            headerColor: 'text-sky-400',
            title: 'have / has + V3',
            example: 'They have finished.',
            exampleColor: 'text-sky-300',
            note: 'Efek dan relevansi aksi masih berhubungan dengan saat ini.',
          },
          {
            header: 'PAST PERFECT',
            headerColor: 'text-amber-400',
            title: 'had + V3',
            example: 'They had finished.',
            exampleColor: 'text-amber-300',
            note: 'Menyatakan aksi yang sudah selesai sebelum aksi lampau lainnya terjadi.',
          },
        ],
        explanation:
          'Perhatikan konsistensi rumusnya: baik di masa sekarang maupun masa lalu, Helper HAVE selalu berpasangan dengan Verb-3!',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 4: Aturan Emas Helper HAVE
  // ---------------------------------------------------------------------------
  {
    slideNum: 4,
    title: 'Aturan Emas Helper HAVE',
    subtitle: 'Kemitraan mutlak dengan Kata Kerja Bentuk Ketiga (Verb-3).',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        formula: {
          tag: 'RUMUS MUTLAK HELPER HAVE',
          text: 'Subjek + HAVE / HAS + Verb-3',
          note: 'Wajib Kata Kerja Bentuk Ke-3 (Past Participle)',
        },
        columns: [
          {
            header: 'ATURAN TATA BAHASA',
            headerColor: 'text-emerald-400',
            title: 'Wajib Verb-3 Murni',
            example: 'have eaten • has arrived',
            exampleColor: 'text-emerald-400',
            note: 'Hanya bentuk ke-3 (Verb-3) yang sah berdiri setelah Helper HAVE atau HAS.',
          },
          {
            header: 'MAKNA SEMANTIK',
            headerColor: 'text-sky-400',
            title: 'Menyatakan "Sudah"',
            example: '"Saya sudah makan"',
            exampleColor: 'text-sky-300',
            note: 'Penegasan bahwa perbuatan tersebut telah beres tuntas dikerjakan.',
          },
        ],
        explanation:
          'Aturan mutlak yang tidak boleh dilanggar: Setiap kata kerja yang ditulis setelah Helper HAVE / HAS / HAD WAJIB ditulis dalam bentuk ke-3 (Verb-3 atau Past Participle).',
      },
      {
        subStep: 2,
        formula: {
          tag: 'HINDARI JEBAKAN FATAL',
          text: 'HAVE + V3 (Benar ✓) vs HAVE + V1/V2 (Salah ✕)',
          note: 'Jangan mencampuradukkan bentuk kata kerja setelah helper!',
        },
        columns: [
          {
            header: 'BENAR (VERB-3 RESMI) ✓',
            headerColor: 'text-emerald-400',
            title: 'They have eaten',
            example: 'eaten = Verb-3',
            exampleColor: 'text-emerald-400',
            note: 'Sempurna! Kata kerja berwujud bentuk ke-3 (Past Participle).',
          },
          {
            header: 'SALAH TOTAL ✕',
            headerColor: 'text-rose-400',
            title: 'have eat ✕ • have ate ✕',
            example: 'have eat (V1) • have ate (V2)',
            exampleColor: 'text-rose-400 line-through',
            note: 'Dilarang keras memasangkan HAVE dengan Verb-1 murni (eat) atau Verb-2 (ate).',
          },
        ],
        explanation:
          'Dilarang keras memasangkan Helper HAVE dengan Verb-1 murni (bukan "have eat") atau Verb-2 (bukan "have ate"). Pasangan resminya adalah Verb-3: "have eaten"!',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 5: Verb-3? Apa itu?
  // ---------------------------------------------------------------------------
  {
    slideNum: 5,
    title: 'Verb-3? Apa itu?',
    subtitle: 'Hakikat Past Participle dalam sistem kata kerja bahasa Inggris.',
    type: 'statement',
    steps: [
      {
        subStep: 1,
        columns: [
          {
            header: 'BENTUK 1 (VERB-1)',
            headerColor: 'text-sky-400',
            title: 'Dasar / Present',
            example: 'play • go • eat',
            exampleColor: 'text-sky-300',
            note: 'Bentuk kamus asli untuk kebiasaan sehari-hari & setelah modal.',
          },
          {
            header: 'BENTUK 2 (VERB-2)',
            headerColor: 'text-amber-400',
            title: 'Lampau / Simple Past',
            example: 'played • went • ate',
            exampleColor: 'text-amber-300',
            note: 'Bentuk masa lalu tanpa helper pada kalimat positif lampau.',
          },
          {
            header: 'BENTUK 3 (VERB-3)',
            headerColor: 'text-emerald-400',
            title: 'Past Participle',
            example: 'played • gone • eaten',
            exampleColor: 'text-emerald-300',
            note: 'Bentuk khusus tuntas yang wajib dikawal oleh Helper HAVE.',
          },
        ],
        explanation:
          'Dalam bahasa Inggris, setiap kata kerja memiliki 3 bentuk wujud: Verb-1 (Dasar), Verb-2 (Lampau), dan Verb-3 (Past Participle). Verb-3 adalah pasangan sejati Helper HAVE.',
      },
      {
        subStep: 2,
        columns: [
          {
            header: 'KELUARGA BE',
            headerColor: 'text-sky-400',
            title: 'be → was/were → been',
            example: 'V3: been',
            exampleColor: 'text-sky-300',
            note: "Bentuk ke-3 dari BE adalah 'been' (Contoh: I have been here).",
          },
          {
            header: 'KELUARGA DO',
            headerColor: 'text-amber-400',
            title: 'do → did → done',
            example: 'V3: done',
            exampleColor: 'text-amber-300',
            note: "Bentuk ke-3 dari DO adalah 'done' (Contoh: I have done my task).",
          },
          {
            header: 'KELUARGA HAVE',
            headerColor: 'text-emerald-400',
            title: 'have → had → had',
            example: 'V3: had',
            exampleColor: 'text-emerald-300',
            note: "Bentuk ke-3 dari HAVE adalah 'had' (Contoh: She has had breakfast).",
          },
        ],
        explanation:
          'Hebatnya, ketiga Helper utama kita (BE, DO, HAVE) juga merupakan kata kerja utuh yang memiliki ketiga bentuk wujud ini secara lengkap!',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 6: Pola Perubahan Bentuk Verb 1-2-3 (VerbMorphingStep Template)
  // ---------------------------------------------------------------------------
  {
    slideNum: 6,
    title: 'Pola Perubahan Bentuk Verb 1-2-3',
    subtitle: 'Perhatikan bagaimana bentuk dasar bertransformasi ke bentuk lampau dan bentuk ketiga.',
    type: 'morph',
    items: [
      {
        id: 'be',
        category: 'HELPER BE (KATA KERJA KHUSUS)',
        morphType: 'rolling',
        breadcrumb: ['be (V1)', 'was/were (V2)', 'been (V3)'],
        explanation: "Bentuk ketiga dari BE adalah 'been'. Digunakan untuk kalimat nominal perfect (have been).",
        stages: [
          { stage: 0, label: 'be (V1)', word: 'be' },
          { stage: 1, label: 'was/were (V2)', word: 'was / were' },
          { stage: 2, label: 'been (V3)', word: 'been' },
        ],
      },
      {
        id: 'do',
        category: 'HELPER DO (KATA KERJA KHUSUS)',
        morphType: 'rolling',
        breadcrumb: ['do (V1)', 'did (V2)', 'done (V3)'],
        explanation: "Bentuk ketiga dari DO adalah 'done'. Contoh: I have done my homework.",
        stages: [
          { stage: 0, label: 'do (V1)', word: 'do' },
          { stage: 1, label: 'did (V2)', word: 'did' },
          { stage: 2, label: 'done (V3)', word: 'done' },
        ],
      },
      {
        id: 'have',
        category: 'HELPER HAVE (KATA KERJA KHUSUS)',
        morphType: 'rolling',
        breadcrumb: ['have (V1)', 'had (V2)', 'had (V3)'],
        explanation: "Bentuk kedua dan ketiga dari kata HAVE adalah sama persis: 'had'.",
        stages: [
          { stage: 0, label: 'have (V1)', word: 'have' },
          { stage: 1, label: 'had (V2)', word: 'had' },
          { stage: 2, label: 'had (V3)', word: 'had' },
        ],
      },
      {
        id: 'close',
        category: 'REGULAR VERB BERAKHIRAN -E',
        morphType: 'stem-suffix',
        stem: 'close',
        suffix: 'd',
        breadcrumb: ['close (V1)', 'closed (V2)', 'closed (V3)'],
        explanation: "Karena berakhiran -e, cukup tambahkan -d. Bentuk V2 dan V3 regular verb sama persis!",
        stages: [
          { stage: 0, label: 'close (V1)', hasSuffix: false, stemColor: 'white' },
          { stage: 1, label: 'closed (V2)', hasSuffix: true, suffixColor: 'sky' },
          { stage: 2, label: 'closed (V3)', hasSuffix: true, suffixColor: 'emerald' },
        ],
      },
      {
        id: 'look',
        category: 'REGULAR VERB STANDAR',
        morphType: 'stem-suffix',
        stem: 'look',
        suffix: 'ed',
        breadcrumb: ['look (V1)', 'looked (V2)', 'looked (V3)'],
        explanation: "Kata kerja berakhiran konsonan mendapat akhiran -ed pada bentuk V2 dan V3.",
        stages: [
          { stage: 0, label: 'look (V1)', hasSuffix: false, stemColor: 'white' },
          { stage: 1, label: 'looked (V2)', hasSuffix: true, suffixColor: 'sky' },
          { stage: 2, label: 'looked (V3)', hasSuffix: true, suffixColor: 'emerald' },
        ],
      },
      {
        id: 'go',
        category: 'IRREGULAR VERB (TIDAK BERATURAN)',
        morphType: 'rolling',
        breadcrumb: ['go (V1)', 'went (V2)', 'gone (V3)'],
        explanation: "Kata kerja tidak beraturan: bentuk V3 dari 'go' adalah 'gone'.",
        stages: [
          { stage: 0, label: 'go (V1)', word: 'go' },
          { stage: 1, label: 'went (V2)', word: 'went' },
          { stage: 2, label: 'gone (V3)', word: 'gone' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 7: Membangun Kalimat Step-by-Step (SentenceConstructionStep Template)
  // ---------------------------------------------------------------------------
  {
    slideNum: 7,
    title: 'Membangun Kalimat Step-by-Step',
    subtitle: 'Evolusi dari aksi dasar menuju penegasan selesai (Present Perfect).',
    type: 'construction',
    steps: [
      {
        subStep: 1,
        mode: 'base',
        modeLabel: 'Aksi Dasar',
        context: 'Mereka pergi (kebiasaan/aksi dasar)',
        explanation: 'Kalimat dasar menyatakan keberangkatan tanpa penegasan efek masa kini.',
        tokens: [
          { id: 'subj', text: 'They', color: 'text-white font-bold' },
          {
            id: 'verb',
            stem: 'go',
            suffix: 'ne',
            hasSuffix: false,
            text: 'go',
            color: 'text-slate-300 font-bold',
            suffixColor: 'text-emerald-400 font-bold',
          },
        ],
      },
      {
        subStep: 2,
        mode: 'pos',
        modeLabel: 'Positif (+)',
        context: 'Mereka SUDAH pergi (sekarang tidak ada di sini)',
        explanation: 'Sisipkan HAVE dan ubah kata kerja ke Verb-3 (gone) untuk menegaskan aksi telah selesai.',
        tokens: [
          { id: 'subj', text: 'They', color: 'text-white font-bold', layoutDelay: 0.4 },
          {
            id: 'helper',
            text: 'have',
            color: 'text-blue-400 font-black',
            delayedEntry: true,
          },
          {
            id: 'verb',
            stem: 'go',
            suffix: 'ne',
            hasSuffix: true,
            text: 'gone',
            color: 'text-emerald-400 font-bold',
            suffixColor: 'text-emerald-400 font-bold',
            layoutDelay: 0.4,
          },
        ],
      },
      {
        subStep: 3,
        mode: 'neg',
        modeLabel: 'Negasi (-)',
        context: 'Mereka BELUM pergi',
        explanation: 'Untuk menyatakan belum, tambahkan NOT tepat setelah HAVE (have not / haven\'t).',
        tokens: [
          { id: 'subj', text: 'They', color: 'text-white font-bold' },
          { id: 'helper', text: 'have', color: 'text-rose-400 font-black' },
          {
            id: 'neg',
            text: 'not',
            color: 'text-rose-400 font-black',
            dynamic: true,
          },
          {
            id: 'verb',
            stem: 'go',
            suffix: 'ne',
            hasSuffix: true,
            text: 'gone',
            color: 'text-sky-400 font-bold',
            suffixColor: 'text-sky-400 font-bold',
          },
        ],
      },
      {
        subStep: 4,
        mode: 'q',
        modeLabel: 'Tanya (?)',
        context: 'Apakah mereka sudah pergi?',
        explanation: 'Tukar posisi HAVE ke depan subjek untuk menanyakan kepastian apakah aksi sudah tuntas.',
        tokens: [
          { id: 'helper', text: 'Have', color: 'text-amber-400 font-black' },
          { id: 'subj', text: 'they', color: 'text-white font-bold' },
          {
            id: 'verb',
            stem: 'go',
            suffix: 'ne',
            hasSuffix: true,
            text: 'gone',
            color: 'text-sky-400 font-bold',
            suffixColor: 'text-sky-400 font-bold',
          },
          { id: 'qmark', text: '?', color: 'text-amber-400 font-black' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 8: Pengalaman & Penanda Waktu Khas (SentenceConstructionStep Template)
  // ---------------------------------------------------------------------------
  {
    slideNum: 8,
    title: 'Pengalaman & Penanda Waktu Khas',
    subtitle: 'Helper HAVE sering dipadukan dengan frekuensi dan pengalaman hidup.',
    type: 'construction',
    steps: [
      {
        subStep: 1,
        mode: 'ex1',
        modeLabel: 'Status Terkini',
        context: 'Lucy sudah tidur (saat ini sedang terlelap)',
        explanation: 'Subjek tunggal "Lucy" memakai HAS + Verb-3 "slept".',
        tokens: [
          { id: 'subj', text: 'Lucy', color: 'text-white font-bold' },
          { id: 'helper', text: 'has', color: 'text-blue-400 font-black' },
          { id: 'verb', text: 'slept', color: 'text-emerald-400 font-bold' },
        ],
      },
      {
        subStep: 2,
        mode: 'ex2',
        modeLabel: 'Pengalaman',
        context: 'Saya sudah mengunjungi nenek dua kali',
        explanation: 'Penanda frekuensi "twice" menegaskan pengalaman hidup yang pernah dilakukan.',
        tokens: [
          { id: 'subj', text: 'I', color: 'text-white font-bold' },
          { id: 'helper', text: 'have', color: 'text-blue-400 font-black' },
          { id: 'verb', text: 'visited', color: 'text-emerald-400 font-bold' },
          { id: 'comp', text: 'grandma twice', color: 'text-slate-200' },
        ],
      },
      {
        subStep: 3,
        mode: 'ex3',
        modeLabel: 'Frekuensi Hari Ini',
        context: 'Saya sudah makan tiga kali hari ini',
        explanation: 'Aktivitas yang sudah berulang dalam kurun waktu yang belum selesai (today).',
        tokens: [
          { id: 'subj', text: 'I', color: 'text-white font-bold' },
          { id: 'helper', text: 'have', color: 'text-blue-400 font-black' },
          { id: 'verb', text: 'eaten', color: 'text-emerald-400 font-bold' },
          { id: 'comp', text: 'three times today', color: 'text-slate-200' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SLIDE 9: Daftar Contoh Transformasi (InteractiveExampleList Template)
  // ---------------------------------------------------------------------------
  {
    slideNum: 9,
    title: 'Daftar Contoh: Transformasi Kalimat',
    subtitle: 'Perhatikan keselarasan Helper HAVE/HAS dengan Verb-3 di setiap state.',
    type: 'interactive-list',
    group: 'sentences',
    rows: [
      {
        id: 'Saya sudah menyelesaikan tugas ini',
        subject: 'I',
        subjectLower: 'you',
        posHelper: 'have',
        helperCap: 'Have',
        negHelper: 'have not',
        verbBase: 'finish',
        verbV3: 'finished',
        complement: 'this task',
      },
      {
        id: 'Dia sudah menemukan kuncinya',
        subject: 'He',
        subjectLower: 'he',
        posHelper: 'has',
        helperCap: 'Has',
        negHelper: 'has not',
        verbBase: 'find',
        verbV3: 'found',
        complement: 'his keys',
      },
      {
        id: 'Sarah sudah sarapan pagi ini',
        subject: 'Sarah',
        subjectLower: 'Sarah',
        posHelper: 'has',
        helperCap: 'Has',
        negHelper: 'has not',
        verbBase: 'eat',
        verbV3: 'eaten',
        complement: 'breakfast',
      },
      {
        id: 'Kami sudah tiba di stasiun',
        subject: 'We',
        subjectLower: 'we',
        posHelper: 'have',
        helperCap: 'Have',
        negHelper: 'have not',
        verbBase: 'arrive',
        verbV3: 'arrived',
        complement: 'at the station',
      },
    ],
  },
];

export const HelperHaveLesson = ({ onBack }) => {
  // Flatten all sub-steps across the 9 slides into a single linear array
  const flatSteps = useMemo(() => {
    const list = [];

    slidesData.forEach((slide, sIdx) => {
      if (slide.type === 'statement' || slide.type === 'construction') {
        slide.steps.forEach((step, subIdx) => {
          list.push({
            slideIdx: sIdx,
            slideNum: slide.slideNum,
            slideTitle: slide.title,
            slideSubtitle: slide.subtitle,
            slideType: slide.type,
            slideData: slide,
            stepData: step,
            subStepIdx: subIdx,
            totalSubStepsInSlide: slide.steps.length,
          });
        });
      } else if (slide.type === 'morph') {
        slide.items.forEach((item, itemIdx) => {
          item.stages.forEach((stage, stageIdx) => {
            list.push({
              slideIdx: sIdx,
              slideNum: slide.slideNum,
              slideTitle: slide.title,
              slideSubtitle: slide.subtitle,
              slideType: slide.type,
              slideData: slide,
              item,
              itemIdx,
              stage,
              stageIdx,
              subStepIdx: itemIdx * 3 + stageIdx,
              totalSubStepsInSlide: slide.items.length * 3,
            });
          });
        });
      } else if (slide.type === 'interactive-list') {
        const totalReveals = slide.rows.length * 3;
        for (let count = 0; count <= totalReveals; count++) {
          list.push({
            slideIdx: sIdx,
            slideNum: slide.slideNum,
            slideTitle: slide.title,
            slideSubtitle: slide.subtitle,
            slideType: slide.type,
            slideData: slide,
            listStepCount: count,
            subStepIdx: count,
            totalSubStepsInSlide: totalReveals + 1,
          });
        }
      }
    });

    return list;
  }, []);

  const [currentFlatIdx, setCurrentFlatIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalFlatSteps = flatSteps.length;
  const currentStep = flatSteps[currentFlatIdx] || flatSteps[0];

  // Micro-step navigation: strictly 1 sub-step per action
  const goToNext = useCallback(() => {
    if (currentFlatIdx < totalFlatSteps - 1) {
      setDirection(1);
      setCurrentFlatIdx((prev) => prev + 1);
    }
  }, [currentFlatIdx, totalFlatSteps]);

  const goToPrev = useCallback(() => {
    if (currentFlatIdx > 0) {
      setDirection(-1);
      setCurrentFlatIdx((prev) => prev - 1);
    }
  }, [currentFlatIdx]);

  // Keyboard navigation: ArrowRight / Space = Next, ArrowLeft = Prev, Esc = Exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onBack]);

  // Direct jumper for morph stages
  const handleJumpToMorphStage = (itemIndex, targetStageIndex) => {
    const targetIdx = flatSteps.findIndex(
      (s) =>
        s.slideIdx === currentStep.slideIdx &&
        s.itemIdx === itemIndex &&
        s.stageIdx === targetStageIndex
    );
    if (targetIdx !== -1) {
      setDirection(targetIdx >= currentFlatIdx ? 1 : -1);
      setCurrentFlatIdx(targetIdx);
    }
  };

  // Direct jumper for interactive list row clicking
  const handleJumpToListRow = (rowIndex) => {
    if (currentStep.slideType !== 'interactive-list') return;
    const currentCount = currentStep.listStepCount;
    const rowBase = rowIndex * 3;
    let nextCount = currentCount;

    if (currentCount <= rowBase) {
      nextCount = rowBase + 1;
    } else if (currentCount === rowBase + 1) {
      nextCount = rowBase + 2;
    } else if (currentCount === rowBase + 2) {
      nextCount = rowBase + 3;
    } else if (currentCount >= rowBase + 3) {
      nextCount = rowBase;
    }

    const targetIdx = flatSteps.findIndex(
      (s) => s.slideIdx === currentStep.slideIdx && s.listStepCount === nextCount
    );
    if (targetIdx !== -1) {
      setDirection(targetIdx >= currentFlatIdx ? 1 : -1);
      setCurrentFlatIdx(targetIdx);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#090a0f] text-zinc-100 select-none font-sans">
      {/* 1. Header (Sticky Top / Fixed) */}
      <header className="w-full shrink-0 z-30 bg-[#090a0f]/90 backdrop-blur-sm border-b border-[#232736]/50 px-4 sm:px-6 md:px-12 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Keluar"
            title="Keluar ke Kurikulum"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border-0 flex items-center justify-center group"
          >
            <LogOut className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
          </button>

          {/* Clean Step Counter */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span>
              Slide {currentStep.slideNum} dari {slidesData.length} • Langkah{' '}
              {currentStep.subStepIdx + 1} dari {currentStep.totalSubStepsInSlide}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Scroll Safe Area (Center Aligned Vertically & Horizontally) */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
        <div className="min-h-full w-full flex flex-col items-center justify-center p-6 md:p-10 text-center">
          <motion.div
            layout
            transition={layoutTransition}
            className="w-full max-w-5xl flex flex-col items-center justify-center my-auto"
          >
            {/* ------------------------------------------------------------- */}
            {/* PERSISTENT HEADER (OUTSIDE AnimatePresence)                   */}
            {/* Smooth layout FLIP animation (min 700ms) with zero jumping   */}
            {/* ------------------------------------------------------------- */}
            <motion.div
              layout
              transition={layoutTransition}
              className="text-center mb-6 max-w-2xl px-4"
            >
              <motion.h1
                layout="position"
                transition={layoutTransition}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2"
              >
                {currentStep.slideTitle}
              </motion.h1>
              <motion.p
                layout="position"
                transition={layoutTransition}
                className="text-sm sm:text-base text-slate-400 leading-relaxed"
              >
                {currentStep.slideSubtitle}
              </motion.p>
            </motion.div>

            {/* ------------------------------------------------------------- */}
            {/* SLIDE CONTENT VIEW (KEYED BY slideNum TO PREVENT UNMOUNTING)  */}
            {/* ------------------------------------------------------------- */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`slide-view-${currentStep.slideNum}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex flex-col items-center justify-center"
              >
                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 1..5: STATEMENT (Concept Explanations)         */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'statement' && (
                  <StatementStep
                    explanation={currentStep.stepData.explanation}
                    columns={currentStep.stepData.columns}
                    formula={currentStep.stepData.formula}
                  />
                )}

                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 6: VERB MORPH STEP                             */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'morph' && (
                  <VerbMorphingStep
                    category={currentStep.item.category}
                    breadcrumb={currentStep.item.breadcrumb}
                    activeBreadcrumbIdx={currentStep.stageIdx}
                    stem={currentStep.item.stem}
                    suffix={currentStep.item.suffix}
                    hasSuffix={currentStep.stage.hasSuffix}
                    suffixColor={
                      currentStep.stage.suffixColor === 'sky'
                        ? 'text-sky-400 font-extrabold'
                        : 'text-emerald-400 font-extrabold'
                    }
                    word={
                      currentStep.item.morphType === 'rolling'
                        ? currentStep.item.stages[currentStep.stageIdx].word
                        : ''
                    }
                    description={currentStep.item.explanation}
                    onBreadcrumbClick={(idx) => handleJumpToMorphStage(currentStep.itemIdx, idx)}
                  />
                )}

                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 7 & 8: SENTENCE CONSTRUCTION                   */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'construction' && (
                  <SentenceConstructionStep
                    contextIndo={currentStep.stepData.context}
                    tokens={currentStep.stepData.tokens}
                    description={currentStep.stepData.explanation}
                  />
                )}

                {/* ----------------------------------------------------------- */}
                {/* RENDER SLIDE 9: INTERACTIVE EXAMPLE LIST                    */}
                {/* ----------------------------------------------------------- */}
                {currentStep.slideType === 'interactive-list' && (
                  <div className="w-full max-w-2xl flex flex-col items-center">
                    <InteractiveExampleList
                      items={currentStep.slideData.rows}
                      revealedRows={currentStep.listStepCount}
                      onRowClick={handleJumpToListRow}
                    />

                    <div className="text-xs text-slate-500 font-mono mt-4">
                      {currentStep.listStepCount < currentStep.slideData.rows.length * 3 ? (
                        <span>
                          Tekan <kbd className="text-slate-300 font-sans">Space</kbd> atau klik panah untuk
                          melanjutkan ({currentStep.listStepCount} / {currentStep.slideData.rows.length * 3})
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">
                          Seluruh contoh tuntas dipelajari!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* 3. Footer Navigasi (Sticky Bottom) */}
      <footer className="w-full shrink-0 z-30 bg-[#090a0f]/90 backdrop-blur-sm border-t border-[#232736]/50 px-4 sm:px-6 md:px-12 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
          {/* Tombol < */}
          <Button
            variant="secondary"
            onClick={goToPrev}
            disabled={currentFlatIdx === 0}
            aria-label="Sebelumnya"
            title="Langkah Sebelumnya (<)"
            className={`w-10 h-10 p-0 flex items-center justify-center rounded-lg ${
              currentFlatIdx === 0 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg
              className="w-4 h-4 fill-current shrink-0 rotate-180"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>

          {/* Stepping Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {slidesData.map((s, idx) => (
              <div
                key={`dot-slide-${idx}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep.slideIdx === idx
                    ? 'w-6 bg-blue-500'
                    : currentStep.slideIdx > idx
                    ? 'w-1.5 bg-blue-500/40'
                    : 'w-1.5 bg-slate-700/60'
                }`}
              />
            ))}
          </div>

          {/* Tombol > */}
          <Button
            variant="primary"
            onClick={goToNext}
            disabled={currentFlatIdx === totalFlatSteps - 1}
            aria-label="Selanjutnya"
            title="Langkah Selanjutnya (> atau Space)"
            className={`w-10 h-10 p-0 flex items-center justify-center rounded-lg ${
              currentFlatIdx === totalFlatSteps - 1 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <svg
              className="w-4 h-4 fill-current shrink-0"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default HelperHaveLesson;
