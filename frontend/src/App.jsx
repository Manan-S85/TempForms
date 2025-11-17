import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Direct imports instead of lazy loading for now
import HomePage from './pages/HomePage';
import CreateFormPage from './pages/CreateFormPage';
import FillFormPage from './pages/FillFormPage';
import ViewResponsesPage from './pages/ViewResponsesPage';
import NotFoundPage from './pages/NotFoundPage';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <Layout>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <HomePage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/create" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <CreateFormPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/form/:shareableLink" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <FillFormPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/responses/:responseLink" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ViewResponsesPage />
                    </motion.div>
                  } 
                />
                <Route 
                  path="*" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <NotFoundPage />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
        </ErrorBoundary>
      </Layout>
    </div>
  );
}

export default App;