import { useDispatch, useSelector } from "react-redux";
import { 
    setLoading, 
    setError, 
    setCreatedQuizzes, 
    addCreatedQuiz, 
    setEnrolledQuizzes, 
    addEnrolledQuiz, 
    setCanTry 
} from "./quizSlice";
import { toast } from "sonner";
import { quizApi } from "../../api/quizApi"; // Import API Layer

export const useQuiz = () => {
    const quizState = useSelector((state) => state.quiz);
    const dispatch = useDispatch();

    // 1. Fetch Created Quizzes (Dashboard)
    const getCreatedQuizzes = async () => {
        try {
            dispatch(setLoading(true));
            const res = await quizApi.getDashboard(); 
            dispatch(setCreatedQuizzes(res.data));
            dispatch(setCanTry(false));   
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to fetch created quizzes.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    // 2. Fetch Enrolled Quizzes
    const getEnrolledQuizzes = async () => {
        try {
            dispatch(setLoading(true));
            const res = await quizApi.getEnrolled();
            dispatch(setEnrolledQuizzes(res.data.quizzes || res.data));
            dispatch(setCanTry(false));   
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to fetch enrolled quizzes.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    // 3. Create a New Quiz
    const createQuiz = async (quizData) => {
        try {
            dispatch(setLoading(true));
            const res = await quizApi.create(quizData);
            const newQuiz = res.data;
            
            // Optimization: Update Redux immediately without re-fetching
            if (newQuiz) {
                dispatch(addCreatedQuiz(newQuiz));
            }
            
            toast.success("Quiz created successfully!");
            return newQuiz;
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to create quiz.";
            dispatch(setError(errorMsg));
            toast.error(errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // 4. Join a Quiz
    const joinQuiz = async (session_id) => {
        try {
            dispatch(setLoading(true));
            const res = await quizApi.join({ session_id: session_id });
            const joinedQuiz = res.data;

            // Optimization: Update Redux immediately
            // (Assuming backend returns the quiz details on join)
            if (joinedQuiz) {
                // If backend structure differs, you might need to map it before pushing
                dispatch(addEnrolledQuiz(joinedQuiz));
            }

            toast.success("Joined quiz successfully!");
            return joinedQuiz;
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to join quiz.";
            dispatch(setError(errorMsg));
            toast.error(err.response?.data?.detail || errorMsg);
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    };

    // NOTE: startQuiz, submitAnswer, etc. are moved to 'useQuizGame.js' 
    // because they belong to "Gameplay", not "Management".

    return {
        quizState,
        getCreatedQuizzes,
        getEnrolledQuizzes,
        createQuiz,
        joinQuiz,
    };
};