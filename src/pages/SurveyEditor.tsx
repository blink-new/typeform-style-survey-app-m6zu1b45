import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Question, QuestionType } from '../lib/types';

export function SurveyEditor() {
  const [title, setTitle] = useState('Untitled Survey');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substring(7),
      type,
      title: '',
      required: true,
      options: type === 'multipleChoice' || type === 'singleChoice' ? [''] : undefined,
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen pt-16">
      {currentQuestionIndex === -1 ? (
        <div className="container mx-auto px-4 py-8 animate-in">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4 border-none bg-transparent px-0 text-4xl font-display font-bold focus-visible:ring-0"
                placeholder="Survey Title"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4 border-none bg-transparent px-0 resize-none focus-visible:ring-0 text-lg text-muted-foreground"
                placeholder="Add a description..."
                rows={2}
              />
            </div>

            <div className="grid gap-4">
              {questions.map((question, index) => (
                <Card
                  key={question.id}
                  className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1 line-clamp-1">
                        {question.title || `Question ${index + 1}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {question.type === 'text' && 'Text response'}
                        {question.type === 'multipleChoice' && 'Multiple choice'}
                        {question.type === 'singleChoice' && 'Single choice'}
                        {question.type === 'rating' && 'Rating'}
                        {question.type === 'email' && 'Email'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuestions(questions.filter((q) => q.id !== question.id));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-8 p-6 border-dashed">
              <h3 className="text-lg font-medium mb-4">Add Question</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-center gap-2"
                  onClick={() => addQuestion('text')}
                >
                  <Plus className="h-5 w-5" />
                  <span>Text</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-center gap-2"
                  onClick={() => addQuestion('multipleChoice')}
                >
                  <Plus className="h-5 w-5" />
                  <span>Multiple Choice</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-center gap-2"
                  onClick={() => addQuestion('singleChoice')}
                >
                  <Plus className="h-5 w-5" />
                  <span>Single Choice</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-center gap-2"
                  onClick={() => addQuestion('rating')}
                >
                  <Plus className="h-5 w-5" />
                  <span>Rating</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 px-4 flex flex-col items-center gap-2"
                  onClick={() => addQuestion('email')}
                >
                  <Plus className="h-5 w-5" />
                  <span>Email</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 animate-in">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              className="mb-8"
              onClick={() => setCurrentQuestionIndex(-1)}
            >
              ← Back to Questions
            </Button>
            <div className="space-y-8">
              <div>
                <Input
                  type="text"
                  value={currentQuestion.title}
                  onChange={(e) =>
                    setQuestions(
                      questions.map((q, i) =>
                        i === currentQuestionIndex ? { ...q, title: e.target.value } : q
                      )
                    )
                  }
                  className="border-none bg-transparent px-0 text-3xl font-display font-bold focus-visible:ring-0"
                  placeholder={`Question ${currentQuestionIndex + 1}`}
                />
              </div>

              {(currentQuestion.type === 'multipleChoice' ||
                currentQuestion.type === 'singleChoice') && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(currentQuestion.options || [])];
                          newOptions[optionIndex] = e.target.value;
                          setQuestions(
                            questions.map((q, i) =>
                              i === currentQuestionIndex ? { ...q, options: newOptions } : q
                            )
                          );
                        }}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="focus-visible:ring-primary"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newOptions = currentQuestion.options?.filter(
                            (_, i) => i !== optionIndex
                          );
                          setQuestions(
                            questions.map((q, i) =>
                              i === currentQuestionIndex ? { ...q, options: newOptions } : q
                            )
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newOptions = [...(currentQuestion.options || []), ''];
                      setQuestions(
                        questions.map((q, i) =>
                          i === currentQuestionIndex ? { ...q, options: newOptions } : q
                        )
                      );
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setQuestions(questions.filter((_, i) => i !== currentQuestionIndex));
                    setCurrentQuestionIndex(-1);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}