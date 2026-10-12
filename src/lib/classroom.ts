export interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  ownerId?: string;
  creationTime?: string;
  updateTime?: string;
  enrollmentCode?: string;
  courseState?: string;
  alternateLink?: string;
  teacherGroupEmail?: string;
  courseGroupEmail?: string;
  guardiansEnabled?: boolean;
}

export interface CourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
  dueTime?: {
    hours: number;
    minutes?: number;
  };
  maxPoints?: number;
  workType?: string;
}

export interface Announcement {
  id: string;
  courseId: string;
  text: string;
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  creatorUserId?: string;
}

export interface UserProfile {
  id: string;
  name?: {
    givenName?: string;
    familyName?: string;
    fullName?: string;
  };
  emailAddress?: string;
  photoUrl?: string;
}

export interface CourseStudent {
  courseId: string;
  userId: string;
  profile?: UserProfile;
}

export interface CourseTeacher {
  courseId: string;
  userId: string;
  profile?: UserProfile;
}

const CLASSROOM_BASE_URL = 'https://classroom.googleapis.com/v1';

async function classroomFetch<T>(endpoint: string, accessToken: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${CLASSROOM_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Classroom API error (${response.status})`);
  }

  return response.json();
}

// 1. Fetch Courses
export async function getCourses(accessToken: string): Promise<Course[]> {
  const data = await classroomFetch<{ courses?: Course[] }>('/courses?courseStates=ACTIVE', accessToken);
  return data.courses || [];
}

// 2. Fetch Course Work (Assignments)
export async function getCourseWork(courseId: string, accessToken: string): Promise<CourseWork[]> {
  const data = await classroomFetch<{ courseWork?: CourseWork[] }>(`/courses/${courseId}/courseWork`, accessToken);
  return data.courseWork || [];
}

// 3. Fetch Announcements
export async function getAnnouncements(courseId: string, accessToken: string): Promise<Announcement[]> {
  const data = await classroomFetch<{ announcements?: Announcement[] }>(`/courses/${courseId}/announcements`, accessToken);
  return data.announcements || [];
}

// 4. Fetch Students
export async function getCourseStudents(courseId: string, accessToken: string): Promise<CourseStudent[]> {
  const data = await classroomFetch<{ students?: CourseStudent[] }>(`/courses/${courseId}/students`, accessToken);
  return data.students || [];
}

// 5. Fetch Teachers
export async function getCourseTeachers(courseId: string, accessToken: string): Promise<CourseTeacher[]> {
  const data = await classroomFetch<{ teachers?: CourseTeacher[] }>(`/courses/${courseId}/teachers`, accessToken);
  return data.teachers || [];
}

// 6. Post Announcement (Mutation - require explicit user confirmation before calling)
export async function postAnnouncement(courseId: string, text: string, accessToken: string): Promise<Announcement> {
  return classroomFetch<Announcement>(`/courses/${courseId}/announcements`, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      text,
      state: 'PUBLISHED',
    }),
  });
}

// 7. Create CourseWork / Assignment (Mutation - require explicit user confirmation before calling)
export async function createCourseWorkItem(
  courseId: string, 
  title: string, 
  description: string, 
  maxPoints: number, 
  accessToken: string
): Promise<CourseWork> {
  return classroomFetch<CourseWork>(`/courses/${courseId}/courseWork`, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      maxPoints,
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
    }),
  });
}
