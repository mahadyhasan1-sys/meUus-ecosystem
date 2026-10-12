import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Globe,
  Bell, 
  Users, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Award,
  Send,
  FileText,
  UserCheck
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../lib/auth';
import { 
  getCourses, 
  getCourseWork, 
  getAnnouncements, 
  getCourseStudents, 
  getCourseTeachers, 
  postAnnouncement, 
  createCourseWorkItem, 
  Course, 
  CourseWork, 
  Announcement, 
  CourseStudent, 
  CourseTeacher 
} from '../lib/classroom';
import { User } from 'firebase/auth';

// Sample mock courses for demo preview mode
const MOCK_COURSES: Course[] = [
  {
    id: 'demo-101',
    name: 'meUus Skills Academy: Digital Literacy & Entrepreneurship',
    section: 'Batch 2026-A (Mirpur Hub)',
    descriptionHeading: 'Unemployment Buster & Business Hub Skills Program',
    description: 'Comprehensive course covering SME formalization, trade license registration, financial planning, and digital business tools.',
    room: 'Room 302',
    enrollmentCode: 'MEUUS2026',
    courseState: 'ACTIVE',
    alternateLink: 'https://classroom.google.com'
  },
  {
    id: 'demo-102',
    name: 'Idea Lab Starter Incubator: Gate 1-3 Preparation',
    section: 'Cohort 4',
    descriptionHeading: 'Startup Foundation Course',
    description: 'Guidelines and templates for passing Gate 1 (Problem Validation) and Gate 2 (Unit Economics).',
    room: 'Innovation Lab',
    enrollmentCode: 'IDEALAB',
    courseState: 'ACTIVE',
    alternateLink: 'https://classroom.google.com'
  }
];

const MOCK_COURSEWORK: CourseWork[] = [
  {
    id: 'cw-1',
    courseId: 'demo-101',
    title: 'Module 1: TIN & Trade License Application Checklist',
    description: 'Draft your business profile and submit the required paperwork checklist for trade license processing.',
    state: 'PUBLISHED',
    maxPoints: 100,
    dueDate: { year: 2026, month: 8, day: 25 },
    dueTime: { hours: 23, minutes: 59 },
    alternateLink: 'https://classroom.google.com'
  },
  {
    id: 'cw-2',
    courseId: 'demo-101',
    title: 'Module 2: Basic Financial Accounting & Cashflow Statement',
    description: 'Download the meUus SME spreadsheet template and fill in month 1 projections.',
    state: 'PUBLISHED',
    maxPoints: 50,
    dueDate: { year: 2026, month: 9, day: 5 },
    dueTime: { hours: 18, minutes: 0 },
    alternateLink: 'https://classroom.google.com'
  }
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    courseId: 'demo-101',
    text: 'Welcome to the meUus Academy! Live Q&A with Legal Hub lawyers will take place this Thursday at 4 PM.',
    creationTime: '2026-08-08T10:00:00Z',
    alternateLink: 'https://classroom.google.com'
  }
];

export default function GoogleClassroomHub() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Classroom Data States
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'announcements' | 'people'>('work');
  
  const [coursework, setCoursework] = useState<CourseWork[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [teachers, setTeachers] = useState<CourseTeacher[]>([]);
  const [fetchingDetails, setFetchingDetails] = useState<boolean>(false);

  // New Item States
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDesc, setNewAssignmentDesc] = useState('');
  const [newAssignmentPoints, setNewAssignmentPoints] = useState(100);
  const [showCreateModal, setShowCreateModal] = useState<'announcement' | 'assignment' | null>(null);
  const [confirmModalData, setConfirmModalData] = useState<{
    type: 'announcement' | 'assignment';
    title: string;
    description: string;
  } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Demo mode state
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setIsDemoMode(false);
        fetchUserCourses(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchUserCourses = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCourses = await getCourses(token);
      setCourses(fetchedCourses);
      if (fetchedCourses.length > 0) {
        setSelectedCourse(fetchedCourses[0]);
        loadCourseDetails(fetchedCourses[0].id, token);
      }
    } catch (err: any) {
      console.error('Error fetching Google Classroom courses:', err);
      setError(err.message || 'Failed to load courses from Google Classroom');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetails = async (courseId: string, token: string) => {
    setFetchingDetails(true);
    try {
      if (isDemoMode) {
        setCoursework(MOCK_COURSEWORK);
        setAnnouncements(MOCK_ANNOUNCEMENTS);
        setStudents([
          { courseId, userId: 's1', profile: { id: 's1', name: { fullName: 'Rahim Uddin' }, emailAddress: 'rahim@example.com' } },
          { courseId, userId: 's2', profile: { id: 's2', name: { fullName: 'Fatima Begum' }, emailAddress: 'fatima@example.com' } }
        ]);
        setTeachers([
          { courseId, userId: 't1', profile: { id: 't1', name: { fullName: 'Mahady Hasan' }, emailAddress: 'mahady@meuus.org' } }
        ]);
        return;
      }

      const [cw, ann, st, tc] = await Promise.allSettled([
        getCourseWork(courseId, token),
        getAnnouncements(courseId, token),
        getCourseStudents(courseId, token),
        getCourseTeachers(courseId, token)
      ]);

      if (cw.status === 'fulfilled') setCoursework(cw.value);
      if (ann.status === 'fulfilled') setAnnouncements(ann.value);
      if (st.status === 'fulfilled') setStudents(st.value);
      if (tc.status === 'fulfilled') setTeachers(tc.value);
    } catch (err: any) {
      console.error('Error loading course details:', err);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setIsDemoMode(false);
        await fetchUserCourses(result.accessToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setCourses([]);
    setSelectedCourse(null);
    setIsDemoMode(false);
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setCourses(MOCK_COURSES);
    setSelectedCourse(MOCK_COURSES[0]);
    setCoursework(MOCK_COURSEWORK);
    setAnnouncements(MOCK_ANNOUNCEMENTS);
    setError(null);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    if (accessToken) {
      loadCourseDetails(course.id, accessToken);
    } else if (isDemoMode) {
      loadCourseDetails(course.id, '');
    }
  };

  // Explicit User Confirmation before creating an announcement or assignment
  const requestConfirmAnnouncement = () => {
    if (!newAnnouncementText.trim()) return;
    setConfirmModalData({
      type: 'announcement',
      title: 'Post New Classroom Announcement',
      description: `You are about to post the following announcement to Google Classroom course "${selectedCourse?.name}":\n\n"${newAnnouncementText}"`
    });
  };

  const requestConfirmAssignment = () => {
    if (!newAssignmentTitle.trim()) return;
    setConfirmModalData({
      type: 'assignment',
      title: 'Create Google Classroom Assignment',
      description: `You are about to create an assignment "${newAssignmentTitle}" worth ${newAssignmentPoints} points in Google Classroom course "${selectedCourse?.name}".`
    });
  };

  const executeConfirmedAction = async () => {
    if (!confirmModalData || !selectedCourse) return;
    
    setIsPublishing(true);
    try {
      if (isDemoMode) {
        if (confirmModalData.type === 'announcement') {
          const newAnn: Announcement = {
            id: `ann-${Date.now()}`,
            courseId: selectedCourse.id,
            text: newAnnouncementText,
            creationTime: new Date().toISOString()
          };
          setAnnouncements(prev => [newAnn, ...prev]);
          setNewAnnouncementText('');
        } else {
          const newCw: CourseWork = {
            id: `cw-${Date.now()}`,
            courseId: selectedCourse.id,
            title: newAssignmentTitle,
            description: newAssignmentDesc,
            maxPoints: newAssignmentPoints,
            state: 'PUBLISHED'
          };
          setCoursework(prev => [newCw, ...prev]);
          setNewAssignmentTitle('');
          setNewAssignmentDesc('');
        }
      } else if (accessToken) {
        if (confirmModalData.type === 'announcement') {
          const created = await postAnnouncement(selectedCourse.id, newAnnouncementText, accessToken);
          setAnnouncements(prev => [created, ...prev]);
          setNewAnnouncementText('');
        } else {
          const created = await createCourseWorkItem(
            selectedCourse.id,
            newAssignmentTitle,
            newAssignmentDesc,
            newAssignmentPoints,
            accessToken
          );
          setCoursework(prev => [created, ...prev]);
          setNewAssignmentTitle('');
          setNewAssignmentDesc('');
        }
      }
      setConfirmModalData(null);
      setShowCreateModal(null);
    } catch (err: any) {
      alert(`Failed to publish: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        icon={<Globe size={18} />}
        title="Google Classroom"
        subtitle="Connected Pedagogical Spaces, Course Workflows, and Student Empowerment."
        badge="Live Sync"
        breadcrumb="Knowledge"
      />
      <section id="education-classroom" className="py-8 px-6 bg-white text-gray-900 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-3">
              <GraduationCap className="w-4 h-4" />
              meUus Skills & Education Platform
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-gray-900">
              Google Classroom Integration
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl text-sm md:text-base">
              Sync your meUus training programs, Idea Lab incubators, and Unemployment Buster skill courses directly with your Google Classroom account.
            </p>
          </div>

          {/* User Auth Profile / GSI Button */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-gray-200/80 border border-gray-300/80 p-2.5 rounded-2xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-9 h-9 rounded-full border border-emerald-500" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{user.displayName || 'Connected User'}</p>
                  <p className="text-[10px] text-gray-500 truncate max-w-[140px]">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-200/50 rounded-xl transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isDemoMode ? (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-200 rounded-full text-xs font-semibold">
                  Demo Preview Mode
                </span>
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  Connect Real Google Account
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Official Material Google Sign-In Styled Button */}
                <button
                  onClick={handleSignIn}
                  disabled={signingIn}
                  className="group relative inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-xl border border-gray-300 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{signingIn ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>

                <button
                  onClick={enableDemoMode}
                  className="text-xs text-gray-500 hover:text-emerald-600 underline transition-colors"
                >
                  Try Demo Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">Google Classroom Integration Notice</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={enableDemoMode}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shrink-0 shadow-xs transition-colors"
            >
              Switch to Demo
            </button>
          </div>
        )}

        {/* Main Interface */}
        {!user && !isDemoMode ? (
          /* Welcome & Sign in Callout */
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto my-6 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-gray-900">
              Connect Your Google Classroom Account
            </h3>
            <p className="text-gray-700 mb-8 text-sm md:text-base leading-relaxed">
              Log in with your Google account to automatically load your enrolled courses, view assignments, track skill progress, and receive official classroom announcements from the meUus instructors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-md"
              >
                <GraduationCap className="w-5 h-5" />
                <span>{signingIn ? 'Connecting...' : 'Authorize Google Classroom'}</span>
              </button>
              <button
                onClick={enableDemoMode}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold rounded-xl border border-gray-300 transition-colors shadow-xs"
              >
                Preview with Demo Courses
              </button>
            </div>
          </div>
        ) : (
          /* Connected / Demo Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar: Course List */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-5 flex flex-col h-fit shadow-sm">
              <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Your Courses ({courses.length})
                </h4>
                {accessToken && (
                  <button
                    onClick={() => fetchUserCourses(accessToken)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200/50 transition-colors"
                    title="Refresh Courses"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Loading your Google Classroom courses...
                </div>
              ) : courses.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm bg-white rounded-2xl border border-gray-200">
                  <p>No active courses found in your Google Classroom.</p>
                  <button
                    onClick={enableDemoMode}
                    className="mt-3 px-3 py-1.5 bg-emerald-600/20 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium"
                  >
                    Load Sample Courses
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {courses.map(course => {
                    const isSelected = selectedCourse?.id === course.id;
                    return (
                      <button
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-lg shadow-emerald-950/20'
                            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm line-clamp-2">{course.name}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-500 shrink-0 font-mono">
                            {course.section || 'Class'}
                          </span>
                        </div>
                        {course.descriptionHeading && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{course.descriptionHeading}</p>
                        )}
                        {course.enrollmentCode && (
                          <div className="mt-2 pt-2 border-t border-gray-200/80 flex items-center justify-between text-[11px] text-gray-500">
                            <span>Code: <code className="text-emerald-600 font-mono">{course.enrollmentCode}</code></span>
                            {course.alternateLink && (
                              <a
                                href={course.alternateLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-emerald-600 hover:underline"
                              >
                                Classroom <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Main Area: Course Content Workspace */}
            <div className="lg:col-span-8 bg-gray-200/50 border border-gray-300/60 rounded-3xl p-6 flex flex-col">
              {selectedCourse ? (
                <>
                  {/* Selected Course Hero Banner */}
                  <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-200 rounded-2xl p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-emerald-600 font-semibold tracking-wider uppercase">
                          {selectedCourse.section || 'Active Course'}
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">{selectedCourse.name}</h3>
                        {selectedCourse.description && (
                          <p className="text-xs text-gray-700 mt-2 line-clamp-2 max-w-xl">{selectedCourse.description}</p>
                        )}
                      </div>
                      {selectedCourse.alternateLink && (
                        <a
                          href={selectedCourse.alternateLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 self-start sm:self-center transition-colors shadow-md"
                        >
                          Open in Classroom <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Workspace Tabs & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-300 pb-3 mb-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('work')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                          activeTab === 'work'
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Classwork & Assignments ({coursework.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('announcements')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                          activeTab === 'announcements'
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                        Announcements ({announcements.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('people')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                          activeTab === 'people'
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        People ({teachers.length + students.length})
                      </button>
                    </div>

                    {/* Action button to trigger user confirmation dialog */}
                    <div className="flex items-center gap-2">
                      {activeTab === 'work' && (
                        <button
                          onClick={() => setShowCreateModal('assignment')}
                          className="px-3 py-1.5 bg-gray-300 hover:bg-gray-600 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> New Assignment
                        </button>
                      )}
                      {activeTab === 'announcements' && (
                        <button
                          onClick={() => setShowCreateModal('announcement')}
                          className="px-3 py-1.5 bg-gray-300 hover:bg-gray-600 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Post Announcement
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tab Content Display */}
                  {fetchingDetails ? (
                    <div className="p-12 text-center text-gray-500">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
                      Loading course content from Google Classroom...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* TAB 1: COURSEWORK */}
                      {activeTab === 'work' && (
                        <div>
                          {coursework.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                              <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                              <p className="text-sm">No course work or assignments posted yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {coursework.map(item => (
                                <div key={item.id} className="p-4 bg-gray-50 border border-gray-300/80 rounded-2xl flex items-start gap-4 hover:border-gray-600 transition-colors">
                                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <h5 className="font-semibold text-sm text-gray-900">{item.title}</h5>
                                      {item.maxPoints && (
                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                          {item.maxPoints} pts
                                        </span>
                                      )}
                                    </div>
                                    {item.description && (
                                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">{item.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-200">
                                      {item.dueDate && (
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3 text-amber-400" />
                                          Due: {item.dueDate.year}-{item.dueDate.month}-{item.dueDate.day}
                                        </span>
                                      )}
                                      {item.alternateLink && (
                                        <a
                                          href={item.alternateLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-emerald-600 hover:underline flex items-center gap-1 ml-auto"
                                        >
                                          View Assignment <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 2: ANNOUNCEMENTS */}
                      {activeTab === 'announcements' && (
                        <div>
                          {announcements.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                              <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                              <p className="text-sm">No announcements in this course yet.</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {announcements.map(ann => (
                                <div key={ann.id} className="p-4 bg-gray-50 border border-gray-300/80 rounded-2xl">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-600 flex items-center justify-center text-xs font-bold">
                                      <Bell className="w-3 h-3" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">Class Announcement</span>
                                    {ann.creationTime && (
                                      <span className="text-[10px] text-gray-400 ml-auto">
                                        {new Date(ann.creationTime).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs md:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap pl-8">
                                    {ann.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TAB 3: PEOPLE */}
                      {activeTab === 'people' && (
                        <div className="space-y-6">
                          {/* Teachers */}
                          <div>
                            <h5 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">Instructors / Teachers</h5>
                            {teachers.length === 0 ? (
                              <p className="text-xs text-gray-500">Teacher information restricted or unavailable.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {teachers.map(t => (
                                  <div key={t.userId} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                                    <UserCheck className="w-5 h-5 text-emerald-600" />
                                    <div className="truncate">
                                      <p className="text-xs font-semibold text-gray-900 truncate">{t.profile?.name?.fullName || 'Teacher'}</p>
                                      <p className="text-[10px] text-gray-500 truncate">{t.profile?.emailAddress || t.userId}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Students */}
                          <div>
                            <h5 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">Enrolled Students</h5>
                            {students.length === 0 ? (
                              <p className="text-xs text-gray-500">Student roster restricted or unavailable.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {students.map(s => (
                                  <div key={s.userId} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <div className="truncate">
                                      <p className="text-xs font-semibold text-gray-900 truncate">{s.profile?.name?.fullName || 'Student'}</p>
                                      <p className="text-[10px] text-gray-500 truncate">{s.profile?.emailAddress || s.userId}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-gray-500 my-auto">
                  Select a course from the list to view coursework and announcements.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal 1: Form to Draft Announcement / Assignment */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-lg w-full text-gray-900 shadow-xl">
              <h4 className="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-gray-900">
                {showCreateModal === 'announcement' ? (
                  <>
                    <Bell className="w-5 h-5 text-emerald-600" /> Post Course Announcement
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 text-emerald-600" /> Create Course Assignment
                  </>
                )}
              </h4>

              {showCreateModal === 'announcement' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Announcement Message</label>
                    <textarea
                      rows={4}
                      value={newAnnouncementText}
                      onChange={e => setNewAnnouncementText(e.target.value)}
                      placeholder="Write announcement for your students..."
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowCreateModal(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={requestConfirmAnnouncement}
                      disabled={!newAnnouncementText.trim()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 shadow-xs"
                    >
                      Review & Publish
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Assignment Title</label>
                    <input
                      type="text"
                      value={newAssignmentTitle}
                      onChange={e => setNewAssignmentTitle(e.target.value)}
                      placeholder="e.g. Module 3: Trade License Paperwork"
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Instructions / Description</label>
                    <textarea
                      rows={3}
                      value={newAssignmentDesc}
                      onChange={e => setNewAssignmentDesc(e.target.value)}
                      placeholder="Detailed assignment instructions..."
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Max Points</label>
                    <input
                      type="number"
                      value={newAssignmentPoints}
                      onChange={e => setNewAssignmentPoints(Number(e.target.value))}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowCreateModal(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={requestConfirmAssignment}
                      disabled={!newAssignmentTitle.trim()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 shadow-xs"
                    >
                      Review & Publish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal 2: MANDATORY Explicit User Confirmation Modal before mutating Classroom Data */}
        {confirmModalData && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border-2 border-amber-500/50 rounded-3xl p-6 max-w-md w-full text-gray-900 shadow-xl">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-200">
                <AlertCircle className="w-6 h-6" />
              </div>

              <h4 className="text-lg font-serif font-bold text-gray-900 mb-2">{confirmModalData.title}</h4>
              <p className="text-xs text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap bg-gray-50 p-3 rounded-xl border border-gray-200">
                {confirmModalData.description}
              </p>

              <p className="text-[11px] text-amber-800 mb-6 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                ⚠️ This action will push changes to Google Classroom and notify enrolled participants.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModalData(null)}
                  disabled={isPublishing}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  Cancel Action
                </button>
                <button
                  onClick={executeConfirmedAction}
                  disabled={isPublishing}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Confirm & Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    </div>
  );
}
