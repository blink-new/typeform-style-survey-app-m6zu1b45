import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Question, QuestionType } from '../../lib/types';
import { Grip, Trash2, Plus, X } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onChange: (updatedQuestion: Question) => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export function QuestionCard({ question, onChange, onDelete, isDragging = false }: QuestionCardProps) {
  const [newOption, setNewOption] = useState('');

  const handleTypeChange = (type: QuestionType) => {
    const updatedQuestion = { ...question, type };
    
    // Reset options if changing from choice type to non-choice type
    if (type !== 'multipleChoice' && type !== 'singleChoice') {
      updatedQuestion.options = [];
    }
    
    // Initialize options array if changing to choice type
    if ((type === 'multipleChoice' || type === 'singleChoice') && !updatedQuestion.options) {
      updatedQuestion.options = [];
    }
    
    // Initialize scale if changing to rating type
    if (type === 'rating' && !updatedQuestion.scale) {
      updatedQuestion.scale = 5;
    }
    
    onChange(updatedQuestion);
  };

  const handleAddOption = () => {
    if (newOption.trim() && question.options) {
      onChange({
        ...question,
        options: [...question.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (question.options) {
      const newOptions = [...question.options];
      newOptions.splice(index, 1);
      onChange({
        ...question,
        options: newOptions
      });
    }
  };

  const handleScaleChange = (value: string) => {
    onChange({
      ...question,
      scale: parseInt(value)
    });
  };

  return (
    <Card className={`mb-4 ${isDragging ? 'opacity-50' : ''}`}>
      <CardHeader className="p-4 pb-0 flex flex-row items-start gap-2">
        <div className="cursor-move mt-1">
          <Grip className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <Input
            value={question.title}
            onChange={(e) => onChange({ ...question, title: e.target.value })}
            placeholder="Question title"
            className="font-medium text-lg border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Textarea
            value={question.description || ''}
            onChange={(e) => onChange({ ...question, description: e.target.value })}
            placeholder="Add description (optional)"
            className="mt-1 resize-none border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground text-sm"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`question-type-${question.id}`}>Question Type</Label>
            <Select
              value={question.type}
              onValueChange={(value) => handleTypeChange(value as QuestionType)}
            >
              <SelectTrigger id={`question-type-${question.id}`}>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="singleChoice">Single Choice</SelectItem>
                <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(question.type === 'singleChoice' || question.type === 'multipleChoice') && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(question.options || [])];
                        newOptions[index] = e.target.value;
                        onChange({ ...question, options: newOptions });
                      }}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add option"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOption();
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleAddOption}
                    className="h-8 w-8"
                    disabled={!newOption.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {question.type === 'rating' && (
            <div className="space-y-2">
              <Label htmlFor={`scale-${question.id}`}>Rating Scale</Label>
              <Select
                value={question.scale?.toString() || '5'}
                onValueChange={handleScaleChange}
              >
                <SelectTrigger id={`scale-${question.id}`}>
                  <SelectValue placeholder="Select scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">1-5</SelectItem>
                  <SelectItem value="10">1-10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id={`required-${question.id}`}
              checked={question.required}
              onCheckedChange={(checked) => onChange({ ...question, required: checked })}
            />
            <Label htmlFor={`required-${question.id}`}>Required question</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}