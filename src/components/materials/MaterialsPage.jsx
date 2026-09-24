import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * MaterialsPage Component
 * Adheres strictly to:
 * - CEFR Categorization: A1 to C2
 * - 4-column card grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6)
 * - Initial card: A1: Helper BE
 * - Strictly NO badges, NO pills, NO tags on or beside labels
 * - Strictly NO extra informative mini-texts above title/label
 * - Strictly NO icons on cards; NO icons wrapped in boxes
 * - Strictly NO outline stroke (border-0)
 * - Fixed height and uniform sizing across card groups
 * - Moderate corner radius (rounded-xl)
 * - Dark mode solid colors, no gradients, no emoji
 */
export const MaterialsPage = ({ onSelectMaterial }) => {
  const [activeCefr, setActiveCefr] = useState('A1');

  // CEFR Levels
  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  // Initial materials list: starting with A1: Helper BE
  const materials = [
    {
      id: 'a1-helper-be',
      cefr: 'A1',
      title: 'Helper BE',
      description: 'Penggunaan am, is, are dalam menghubungkan subjek dengan kata sifat, benda, dan tempat.',
    },
    {
      id: 'a1-helper-be-continuous',
      cefr: 'A1',
      title: 'Helper BE (Continuous)',
      description: 'Penggunaan Helper BE sebelum Verb-ing dalam kalimat yang sedang berlangsung.',
    },
    {
      id: 'a1-present-tense',
      cefr: 'A1',
      title: 'Simple Present Tense',
      description: 'Aturan kata kerja V tanpa s/es untuk I/You/They/We dan V + s/es untuk He/She/It.',
    },
    {
      id: 'a1-kalimat-tanya',
      cefr: 'A1',
      title: 'Kalimat Tanya',
      description: 'Cara membentuk kalimat tanya dengan menukar posisi subjek dan helpernya (am, is, are).',
    },
    {
      id: 'a1-negative-state',
      cefr: 'A1',
      title: 'Negative State',
      description: 'Membentuk kalimat negatif dengan menambahkan NOT setelah Helper (am, is, are).',
    },
    {
      id: 'a1-helper-do',
      cefr: 'A1',
      title: 'Helper DO (do / does)',
      description: 'Penggunaan Helper DO dalam membentuk kalimat tanya (?) dan kalimat negatif (-) pada Simple Present Tense.',
    },
    {
      id: 'a1-verb-1-verb-2',
      cefr: 'A1',
      title: 'Verb 1 & Verb 2 (Konsep Masa Lalu)',
      description: 'Konsep penggunaan Past Tense, time signal, perubahan V1 ke V2 (Regular & Irregular), dan contoh kalimat.',
    },
    {
      id: 'a1-helper-be-past',
      cefr: 'A1',
      title: 'Helper BE Past (was / were)',
      description: 'Penggunaan was & were pada kalimat nominal dan kegiatan yang sedang berlangsung di masa lampau (Past Continuous).',
    },
    {
      id: 'a1-helper-did',
      cefr: 'A1',
      title: 'Helper DID (Simple Past Verbal)',
      description: 'Penggunaan Helper DID pada kalimat verbal lampau, aturan kembali ke Verb 1, serta pembentukan kalimat (-) dan (?).',
    },
    {
      id: 'a1-helper-modal-will',
      cefr: 'A1',
      title: 'Helper MODAL (will) - Masa Depan',
      description: 'Pengenalan waktu masa depan (Future Tense), penanda waktu, aturan universal WILL, serta kalimat (-) dan (?).',
    },
    {
      id: 'a1-prepositions',
      cefr: 'A1',
      title: 'Unit 3: Prepositions of Time & Place (IN, ON, AT)',
      description: 'Pondasi piramida IN (Umum), ON (Spesifik), AT (Titik Presisi) untuk waktu & tempat serta jebakan umumnya.',
    },
    {
      id: 'a2-helper-have',
      cefr: 'A2',
      title: 'Unit 1: Helper HAVE, HAS, HAD & Verb 3',
      description: 'Peran ganda have, pembagian subjek, hakikat & pola Verb 3, helper had, dan komparasi tuntas vs Past Simple.',
    },
    {
      id: 'a1-the-big-picture',
      cefr: 'A1',
      title: 'The Big Picture: Matriks 3 Waktu & Rumus Universal',
      description: 'Rangkuman penutup A1: Peta 3 waktu (Present, Past, Future), 4 keluarga helper, dan 2 aturan universal kalimat (-) & (?).',
    },
    {
      id: 'a1-grammar-playground',
      cefr: 'A1',
      title: 'Grammar Playground (Sentence Builder)',
      description: 'Simulator tata bahasa interaktif: bereksperimen mengubah subjek, kata kerja, tense, dan time signal secara real-time.',
    },
  ];

  const filteredMaterials = materials.filter((m) => m.cefr === activeCefr);

  return (
    <section className="flex-1 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full select-none">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
          Grammar Curriculum
        </h1>
      </div>

      {/* CEFR Level Selector - Solid buttons, equal size, no outline stroke */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        {cefrLevels.map((level) => {
          const isActive = activeCefr === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => setActiveCefr(level)}
              className={`
                h-10 px-5 rounded-lg text-sm font-medium transition-colors
                whitespace-nowrap cursor-pointer border-0
                ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#181a24] text-zinc-300 hover:bg-[#202330] hover:text-white'
                }
              `}
            >
              {level}
            </button>
          );
        })}
      </div>

      {/* 4-Column Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMaterials.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onSelectMaterial && onSelectMaterial(item)}
            className="
              h-44 p-6 rounded-xl bg-[#12141c] hover:bg-[#181b26]
              transition-colors flex flex-col justify-between
              cursor-pointer border-0 select-none
            "
          >
            <div>
              {/* No mini category text or badge above title per absolute rules */}
              <h2 className="text-base font-semibold text-white tracking-tight mb-2 truncate">
                {item.title}
              </h2>
              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-medium text-blue-400">
                Study Material
              </span>
            </div>
          </motion.div>
        ))}

        {filteredMaterials.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
            Materi level {activeCefr} sedang dalam proses penyusunan.
          </div>
        )}
      </div>
    </section>
  );
};

export default MaterialsPage;
