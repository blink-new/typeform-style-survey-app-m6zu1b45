import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockSurveys, mockResponses, Survey } from '../lib/types';
import { Edit, Eye, BarChart3, Copy, Trash2, Share2, PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export function Dashboard() {
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys);
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredSurveys = surveys.filter(survey => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return survey.published;
    if (activeTab === 'drafts') return !survey.published;
    return true;
  });

  const getResponseCount = (surveyId: string) => {
    return mockResponses.filter(response => response.surveyId === surveyId).length;
  };

  const handleDeleteSurvey = (surveyId: string) => {
    setSurveys(surveys.filter(survey => survey.id !== surveyId));
    toast.success('Survey deleted successfully');
  };

  const handleDuplicateSurvey = (survey: Survey) => {
    const newSurvey = {
      ...survey,
      id: `${survey.id}-copy`,
      title: `${survey.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: false,
    };
    
    setSurveys([...surveys, newSurvey]);
    toast.success('Survey duplicated successfully');
  };

  const handleShareSurvey = (surveyId: string) => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(`${window.location.origin}/s/${surveyId}`);
    toast.success('Survey link copied to clipboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Surveys</h1>
          <p className="text-muted-foreground">Create, manage, and analyze your surveys</p>
        </div>
        <Link to="/create">
          <Button size="lg" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>New Survey</span>
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Surveys</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredSurveys.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-medium">No surveys found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {activeTab === 'all'
              ? "You haven't created any surveys yet."
              : activeTab === 'published'
              ? "You don't have any published surveys."
              : "You don't have any draft surveys."}
          </p>
          <Link to="/create">
            <Button>Create a Survey</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSurveys.map((survey) => (
            <Card key={survey.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">{survey.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {survey.description || 'No description'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    {survey.published ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{survey.questions.length}</p>
                      <p className="text-xs text-muted-foreground">Questions</p>
                    </div>
                    <div>
                      <p className="font-medium">{getResponseCount(survey.id)}</p>
                      <p className="text-xs text-muted-foreground">Responses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(survey.updatedAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center gap-2 border-t bg-muted/20 p-3">
                <Link to={`/edit/${survey.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>
                </Link>
                <Link to={`/preview/${survey.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </Button>
                </Link>
                <Link to={`/results/${survey.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Results</span>
                  </Button>
                </Link>
                <div className="flex-1" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleShareSurvey(survey.id)}
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleDuplicateSurvey(survey)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteSurvey(survey.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}