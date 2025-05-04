import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Plus, Trash2, GripVertical, Settings } from 'lucide-react';
import { Question, QuestionType } from '../lib/types';

export function SurveyEditor() {
  const [title, setTitle] = useState('Untitled Survey');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substring(7),
      type,
      title: '',
      required: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 border-none bg-transparent px-0 text-3xl font-bold focus-visible:ring-0"
          placeholder="Survey Title"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 border-none bg-transparent px-0 resize-none focus-visible:ring-0"
          placeholder="Add a description..."
          rows={2}
        />
      </div>

      <div className="mb-8 space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="p-4">
            <div className="flex items-start gap-4">
              <button className="mt-3 cursor-grab opacity-50 hover:opacity-100">
                <GripVertical className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <Input
                  type="text"
                  value={question.title}
                  onChange={(e) =>
                    setQuestions(
                      questions.map((q) =>
                        q.id === question.id ? { ...q, title: e.target.value } : q
                      )
                    )
                  }
                  className="mb-2"
                  placeholder={`Question ${index + 1}`}
                />
                {question.type === 'multipleChoice' || question.type === 'singleChoice' ? (
                  <div className="mt-2 space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(question.options || [])];
                            newOptions[optionIndex] = e.target.value;
                            setQuestions(
                              questions.map((q) =>
                                q.id === question.id ? { ...q, options: newOptions } : q
                              )
                            );
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newOptions = question.options?.filter((_, i) => i !== optionIndex);
                            setQuestions(
                              questions.map((q) =>
                                q.id === question.id ? { ...q, options: newOptions } : q
                              )
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      className="mt-2"
                      onClick={() => {
                        const newOptions = [...(question.options || []), ''];
                        setQuestions(
                          questions.map((q) =>
                            q.id === question.id ? { ...q, options: newOptions } : q
                          )
                        );
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuestions(questions.filter((q) => q.id !== question.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="mb-4 text-sm font-medium">Add Question</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => addQuestion('text')}>
            <Plus className="mr-2 h-4 w-4" />
            Text
          </Button>
          <Button variant="outline" onClick={() => addQuestion('multipleChoice')}>
            <Plus className="mr-2 h-4 w-4" />
            Multiple Choice
          </Button>
          <Button variant="outline" onClick={() => addQuestion('singleChoice')}>
            <Plus className="mr-2 h-4 w-4" />
            Single Choice
          </Button>
          <Button variant="outline" onClick={() => addQuestion('rating')}>
            <Plus className="mr-2 h-4 w-4" />
            Rating
          </Button>
          <Button variant="outline" onClick={() => addQuestion('email')}>
            <Plus className="mr-2 h-4 w-4" />
            Email
          </Button>
        </div>
      </Card>
    </div>
  );
}