import { createStore } from "zustand/vanilla";
import EnrollmentsAPIClient from "@/APIClients/EnrollmentsAPIClient";
import { Term, TermCourse } from "@/types/Types";

export type CounterState = {
  termCourses: TermCourse[];
  term: Term;
};

export type CounterActions = {
  deleteTermCourse: (course: TermCourse) => void
  addTermCourse: (course: TermCourse) => void
  fetchTermCourses: () => void
  setTerm: (term: Term) => void
};

export type CounterStore = CounterState & CounterActions;

export const initDashboardStore = (): CounterState => {
  return { 
    termCourses: [],
    term: "1A"
  }
}

export const defaultInitState: CounterState = {
  termCourses: [],
  term: "1A"
};


const fetchTermCourses = async (term: Term) => {
  return (await EnrollmentsAPIClient.getCourses(term) ?? []);
}

const addTermCourse = async (course: TermCourse, termCourses: TermCourse[], term: Term): Promise<TermCourse[]> => {
  const data = await EnrollmentsAPIClient.addCourse(course, term);
  const isDuplicate = termCourses.some((termCourse) => termCourse.id === course.id);
  if (isDuplicate){
    return termCourses;
  }
  return [...termCourses, course];
};

const deleteTermCourse = async (course: TermCourse, termCourses: TermCourse[], term: Term) : Promise<TermCourse[]> => {
  const data = await EnrollmentsAPIClient.dropCourse(course, term);
  const newCourses = termCourses.filter((item)=>item.id!==course.id);
  return newCourses;
};

export const createCounterStore = (
  initState: CounterState = defaultInitState,
) => {
  return createStore<CounterStore>()((set, get) => ({
    ...initState,
    deleteTermCourse: async (course: TermCourse) => {
      const currState = get();
      const newCourses = await deleteTermCourse(course, currState.termCourses, currState.term);
      set((state) => {
	return { termCourses: newCourses };
      })
    },
    addTermCourse: async (course: TermCourse) => {
      const currState = get();
      const newCourses = await addTermCourse(course, currState.termCourses, currState.term);
      set((state) => {
	return { termCourses: newCourses };
      })
    },
    fetchTermCourses: async () => {
      const currState = get();
      const courses = await fetchTermCourses(currState.term);
      set((state) => {
	return { termCourses: courses }
      })
    },
    setTerm: async (term: Term) => {
      set((state) => ({
	term: term
      }));
      get().fetchTermCourses();
    }
  }))
};
