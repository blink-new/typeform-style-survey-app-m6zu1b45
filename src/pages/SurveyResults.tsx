import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockSurveys, mockResponses, Survey, Response } from '../lib/types';
import { ChevronLeft, Download, BarChart3, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function SurveyResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundSurvey = mockSurveys.find(s => s.id === id);
      if (foundSurvey) {
        setSurvey(foundSurvey);
        const surveyResponses = mockResponses.filter(r => r.surveyId === id);
        setResponses(surveyResponses);
      } else {
        toast.error('Survey not found');
        navigate('/');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!survey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Survey not found</h1>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  // Generate summary data for charts
  const generateChartData = () => {
    const chartData: Record<string, any[]> = {};
    
    survey.questions.forEach(question => {
      if (question.type === 'singleChoice' || question.type === 'multipleChoice') {
        const optionCounts: Record<string, number> = {};
        
        // Initialize all options with 0 count
        question.options?.forEach(option => {
          optionCounts[option] = 0;
        });
        
        // Count responses for each option
        responses.forEach(response => {
          const answer = response.answers.find(a => a.questionId === question.id);
          if (answer) {
            if (Array.isArray(answer.value)) {
              // Multiple choice
              answer.value.forEach(val => {
                if (optionCounts[val] !== undefined) {
                  optionCounts[val]++;
                }
              });
            } else if (typeof answer.value === 'string') {
              // Single choice
              if (optionCounts[answer.value] !== undefined) {
                optionCounts[answer.value]++;
              }
            }
          }
        });
        
        // Convert to chart data format
        chartData[question.id] = Object.entries(optionCounts).map(([name, value]) => ({
          name,
          value
        }));
      } else if (question.type === 'rating') {
        const ratingCounts: Record<number, number> = {};
        
        // Initialize all ratings with 0 count
        for (let i = 1; i <= (question.scale || 5); i++) {
          ratingCounts[i] = 0;
        }
        
        // Count responses for each rating
        responses.forEach(response => {
          const answer = response.answers.find(a => a.questionId === question.id);
          if (answer && typeof answer.value === 'number') {
            if (ratingCounts[answer.value] !== undefined) {
              ratingCounts[answer.value]++;
            }
          }
        });
        
        // Convert to chart data format
        chartData[question.id] = Object.entries(ratingCounts).map(([rating, count]) => ({
          name: `Rating ${rating}`,
          value: count
        }));
      }
    });
    
    return chartData;
  };

  const chartData = generateChartData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const exportResponses = () => {
    toast('Export functionality coming soon');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4 gap-1 text-muted-foreground"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{survey.title}</h1>
            <p className="text-muted-foreground">
              {survey.description || 'No description'}
            </p>
          </div>
          <Button variant="outline" className="gap-1" onClick={exportResponses}>
            <Download className="h-4 w-4" />
            <span>Export Responses</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-3xl font-bold">{responses.length}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">100%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {responses.length > 0
                ? formatDistanceToNow(responses[responses.length - 1].createdAt, { addSuffix: true })
                : 'No responses yet'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="responses">Individual Responses</TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="summary" className="mt-0">
        {responses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No responses yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Share your survey to start collecting responses
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {survey.questions.map(question => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle>{question.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {(question.type === 'singleChoice' || question.type === 'multipleChoice') && chartData[question.id] ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData[question.id]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData[question.id].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : question.type === 'rating' && chartData[question.id] ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData[question.id]}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8">
                            {chartData[question.id].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Text responses are shown in the Individual Responses tab
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="responses" className="mt-0">
        {responses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-medium">No responses yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Share your survey to start collecting responses
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {responses.map((response, index) => (
              <Card key={response.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Response #{index + 1} - {formatDistanceToNow(response.createdAt, { addSuffix: true })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {response.answers.map(answer => {
                      const question = survey.questions.find(q => q.id === answer.questionId);
                      return (
                        <div key={answer.questionId} className="border-b pb-3">
                          <div className="font-medium">{question?.title}</div>
                          <div className="mt-1">
                            {Array.isArray(answer.value) ? (
                              answer.value.join(', ')
                            ) : typeof answer.value === 'number' ? (
                              `Rating: ${answer.value}`
                            ) : (
                              answer.value
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </div>
  );
}