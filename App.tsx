
import React, { useState, useCallback } from 'react';
import type { GeneratedStory } from './types';
import { generateStory } from './services/geminiService';
import { Header } from './components/Header';
import { StoryForm } from './components/StoryForm';
import { StoryDisplay } from './components/StoryDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';

function App() {
  const [topics, setTopics] = useState<[string, string]>(['', '']);
  const [generatedContent, setGeneratedContent] = useState<GeneratedStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (topic1: string, topic2: string) => {
    if (!topic1 && !topic2) {
      setError("Lütfen masal oluşturmak için en az bir konu girin.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setTopics([topic1, topic2]);

    try {
      const result = await generateStory(topic1, topic2);
      setGeneratedContent(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Masal oluşturulurken bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setTopics(['', '']);
    setGeneratedContent(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-100 to-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          {!generatedContent && !isLoading && (
            <StoryForm onGenerate={handleGenerate} isLoading={isLoading} initialTopics={topics} />
          )}

          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && (
             <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                <p className="text-red-600 font-semibold text-lg">{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        setGeneratedContent(null);
                    }}
                    className="mt-6 px-6 py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors duration-300"
                >
                    Tekrar Dene
                </button>
            </div>
          )}

          {generatedContent && !isLoading && (
            <StoryDisplay storyData={generatedContent} onReset={handleReset} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;