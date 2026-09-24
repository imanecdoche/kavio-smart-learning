import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Header from './components/Header';
import Hero from './components/Hero';
import LoginPage from './components/auth/LoginPage';
import MaterialsPage from './components/materials/MaterialsPage';
import HelperBeLesson from './components/materials/HelperBeLesson';
import HelperBeContinuousLesson from './components/materials/HelperBeContinuousLesson';
import PresentTenseLesson from './components/materials/PresentTenseLesson';
import KalimatTanyaLesson from './components/materials/KalimatTanyaLesson';
import NegativeStateLesson from './components/materials/NegativeStateLesson';
import HelperDoLesson from './components/materials/HelperDoLesson';
import Verb1Verb2Lesson from './components/materials/Verb1Verb2Lesson';
import HelperBePastLesson from './components/materials/HelperBePastLesson';
import HelperDidLesson from './components/materials/HelperDidLesson';
import HelperModalWillLesson from './components/materials/HelperModalWillLesson';
import TheBigPictureLesson from './components/materials/TheBigPictureLesson';
import PrepositionsLesson from './components/materials/PrepositionsLesson';
import HelperHaveLesson from './components/materials/HelperHaveLesson';
import GrammarPlayground from './components/materials/GrammarPlayground';
import ProfileSettingsPage from './components/profile/ProfileSettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [playgroundPreset, setPlaygroundPreset] = useState(null);
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const saved = localStorage.getItem('kavio_active_view');
    return hash || saved || 'home';
  });

  const navigateTo = (view, preset = null) => {
    if (preset) {
      setPlaygroundPreset(preset);
    }
    setCurrentView(view);
    localStorage.setItem('kavio_active_view', view);
    window.location.hash = view;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentView(hash);
        localStorage.setItem('kavio_active_view', hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // While checking session on refresh, maintain steady dark canvas
  if (loading) {
    return <div className="min-h-screen bg-[#090a0f]" />;
  }

  const isStudyView = [
    'helper-be',
    'helper-be-continuous',
    'present-tense',
    'kalimat-tanya',
    'negative-state',
    'helper-do',
    'verb-1-verb-2',
    'helper-be-past',
    'helper-did',
    'helper-modal-will',
    'prepositions',
    'helper-have',
    'the-big-picture',
    'grammar-playground',
  ].includes(currentView);

  return (
    <div className={`bg-slate-50 text-slate-900 dark:bg-[#090a0f] dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 ${isStudyView ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
      {!isStudyView && <Header onNavigate={navigateTo} />}

      <main className="flex-1 flex flex-col overflow-hidden">
        {!user ? (
          // Initial page is login page if no active session
          <LoginPage />
        ) : currentView === 'settings' ? (
          // Profile Settings Page
          <ProfileSettingsPage onBack={() => navigateTo('materials')} />
        ) : currentView === 'materials' ? (
          // Learning Materials Dashboard with 4-column card grid
          <MaterialsPage
            onSelectMaterial={(item) => {
              if (item?.id === 'a1-helper-be-continuous') {
                navigateTo('helper-be-continuous');
              } else if (item?.id === 'a1-present-tense') {
                navigateTo('present-tense');
              } else if (item?.id === 'a1-kalimat-tanya') {
                navigateTo('kalimat-tanya');
              } else if (item?.id === 'a1-negative-state') {
                navigateTo('negative-state');
              } else if (item?.id === 'a1-helper-do') {
                navigateTo('helper-do');
              } else if (item?.id === 'a1-verb-1-verb-2') {
                navigateTo('verb-1-verb-2');
              } else if (item?.id === 'a1-helper-be-past') {
                navigateTo('helper-be-past');
              } else if (item?.id === 'a1-helper-did') {
                navigateTo('helper-did');
              } else if (item?.id === 'a1-helper-modal-will') {
                navigateTo('helper-modal-will');
              } else if (item?.id === 'a1-prepositions') {
                navigateTo('prepositions');
              } else if (item?.id === 'a2-helper-have' || item?.id === 'a1-helper-have') {
                navigateTo('helper-have');
              } else if (item?.id === 'a1-the-big-picture') {
                navigateTo('the-big-picture');
              } else if (item?.id === 'a1-grammar-playground') {
                navigateTo('grammar-playground');
              } else {
                navigateTo('helper-be');
              }
            }}
          />
        ) : currentView === 'helper-be' ? (
          // Interactive Slideshow for Helper BE
          <HelperBeLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'helper-be-continuous' ? (
          // Interactive Slideshow for Helper BE in Continuous
          <HelperBeContinuousLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'present-tense' ? (
          // Interactive Slideshow for Simple Present Tense
          <PresentTenseLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'kalimat-tanya' ? (
          // Interactive Slideshow for Kalimat Tanya
          <KalimatTanyaLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'negative-state' ? (
          // Interactive Slideshow for Negative State
          <NegativeStateLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'helper-do' ? (
          // Interactive Slideshow for Helper DO (do / does)
          <HelperDoLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'verb-1-verb-2' ? (
          // Interactive Slideshow for Verb 1 & Verb 2 (Past Verbs)
          <Verb1Verb2Lesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'helper-be-past' ? (
          // Interactive Slideshow for Helper BE Past (was / were) & Past Continuous
          <HelperBePastLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'helper-did' ? (
          // Interactive Slideshow for Helper DID (Simple Past Verbal)
          <HelperDidLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'helper-modal-will' ? (
          // Interactive Slideshow for Helper MODAL (will) - Simple Future
          <HelperModalWillLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'prepositions' ? (
          // Interactive Slideshow for Prepositions of Time & Place (IN, ON, AT)
          <PrepositionsLesson
            onBack={() => navigateTo('materials')}
            onOpenPlayground={(preset) => navigateTo('grammar-playground', preset)}
          />
        ) : currentView === 'helper-have' ? (
          // Interactive Slideshow for Helper HAVE, HAS, HAD & Verb 3
          <HelperHaveLesson
            onBack={() => navigateTo('materials')}
            onOpenPlayground={(preset) => navigateTo('grammar-playground', preset)}
          />
        ) : currentView === 'the-big-picture' ? (
          // Interactive Slideshow for The Big Picture A1
          <TheBigPictureLesson onBack={() => navigateTo('materials')} />
        ) : currentView === 'grammar-playground' ? (
          // Grammar Playground / Interactive Sentence Builder
          <GrammarPlayground
            onBack={() => navigateTo('materials')}
            initialConfig={playgroundPreset}
          />
        ) : (
          // Hero Section
          <Hero onStartLearning={() => navigateTo('materials')} />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
