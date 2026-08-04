// import { useState, useEffect } from "react";
// import {
//   Clock,
//   Send,
//   ChevronLeft,
//   ChevronRight,
//   AlertCircle,
// } from "lucide-react";
// import { useParams, useNavigate } from "react-router-dom";

// const TakeExam = () => {
//   const { applicationId } = useParams();
//   const navigate = useNavigate();

//   const [exam, setExam] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
//   const [autoSubmitWarning, setAutoSubmitWarning] = useState(false);

//   useEffect(() => {
//     startExam();
//   }, [applicationId]);

//   useEffect(() => {
//     if (timeRemaining > 0) {
//       const timer = setInterval(() => {
//         setTimeRemaining((prev) => {
//           if (prev <= 60) {
//             setAutoSubmitWarning(true);
//           }
//           if (prev <= 1) {
//             autoSubmit();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [timeRemaining]);

//   // const startExam = async () => {
//   //   try {
//   //     // API call to start exam
//   //     // const response = await axios.post('/api/exams/start', { applicationId });
//   //     // setExam(response.data.exam);
//   //     // setQuestions(response.data.questions);
//   //     // setTimeRemaining(response.data.exam.duration * 60);

//   //     // Mock data
//   //     setExam({
//   //       _id: '1',
//   //       test: { title: 'JLPT N5 Practice Test', duration: 60 },
//   //       duration: 60
//   //     });
//   //     setQuestions([
//   //       {
//   //         _id: '1',
//   //         type: 'mcq',
//   //         question: 'What is the Japanese word for "hello"?',
//   //         options: [
//   //           { _id: 'a', text: 'Konnichiwa', isCorrect: true },
//   //           { _id: 'b', text: 'Sayonara', isCorrect: false },
//   //           { _id: 'c', text: 'Arigatou', isCorrect: false },
//   //           { _id: 'd', text: 'Sumimasen', isCorrect: false }
//   //         ],
//   //         marks: 1
//   //       },
//   //       {
//   //         _id: '2',
//   //         type: 'true_false',
//   //         question: 'Japanese has three writing systems: Hiragana, Katakana, and Kanji.',
//   //         marks: 1
//   //       },
//   //       {
//   //         _id: '3',
//   //         type: 'fill_in_blanks',
//   //         question: 'The capital of Japan is _____.',
//   //         blanks: [{ answer: 'Tokyo', caseSensitive: false }],
//   //         marks: 1
//   //       },
//   //       {
//   //         _id: '4',
//   //         type: 'writing',
//   //         question: 'Write a short paragraph about your favorite Japanese food.',
//   //         marks: 5
//   //       }
//   //     ]);
//   //     setTimeRemaining(60 * 60); // 60 minutes in seconds
//   //     setLoading(false);
//   //   } catch (error) {
//   //     console.error('Error starting exam:', error);
//   //     alert('Error starting exam. Please try again.');
//   //     navigate('/student/upcoming-tests');
//   //   }
//   // };

//   const handleAnswerChange = (questionId, answer) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: answer,
//     }));

//     // Auto-save answer
//     saveAnswer(questionId, answer);
//   };

//   const saveAnswer = async (questionId, answer) => {
//     try {
//       // API call to save answer
//       await axios.post("/api/exams/save-answer", {
//         examId: exam._id,
//         questionId,
//         answer,
//         timeSpent: 0,
//       });
//     } catch (error) {
//       console.error("Error saving answer:", error);
//     }
//   };

//   const autoSubmit = async () => {
//     setSubmitting(true);
//     try {
//       // API call to auto-submit
//       await axios.post(`/api/exams/${exam._id}/auto-submit`);
//       alert("Your exam has been auto-submitted due to time expiry.");
//       navigate("/student/results");
//     } catch (error) {
//       console.error("Error auto-submitting exam:", error);
//     }
//     setSubmitting(false);
//   };

//   const submitExam = async () => {
//     setSubmitting(true);
//     try {
//       // API call to submit exam
//       // await axios.post(`/api/exams/${exam._id}/submit`);
//       alert("Exam submitted successfully!");
//       navigate("/student/results");
//     } catch (error) {
//       console.error("Error submitting exam:", error);
//       alert("Error submitting exam. Please try again.");
//     }
//     setSubmitting(false);
//     setShowSubmitConfirm(false);
//   };

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const goToQuestion = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   const goToPrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1);
//     }
//   };

//   const goToNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     }
//   };

//   const answeredCount = Object.keys(answers).length;
//   const progress = (answeredCount / questions.length) * 100;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading exam...</p>
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 {exam?.test?.title}
//               </h1>
//               <p className="text-sm text-gray-600">
//                 Question {currentQuestionIndex + 1} of {questions.length}
//               </p>
//             </div>
//             <div
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//                 autoSubmitWarning
//                   ? "bg-red-100 text-red-700"
//                   : "bg-blue-100 text-blue-700"
//               }`}
//             >
//               <Clock size={20} />
//               <span className="font-mono font-bold">
//                 {formatTime(timeRemaining)}
//               </span>
//             </div>
//           </div>

//           {/* Progress bar */}
//           <div className="mt-4">
//             <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
//               <span>
//                 Progress: {answeredCount}/{questions.length} answered
//               </span>
//               <span>{Math.round(progress)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Question Panel */}
//           <div className="lg:col-span-3">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//               {/* Question Type Badge */}
//               <div className="mb-4">
//                 <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
//                   {currentQuestion?.type?.replace("_", " ")}
//                 </span>
//                 <span className="ml-2 text-sm text-gray-600">
//                   Marks: {currentQuestion?.marks}
//                 </span>
//               </div>

//               {/* Question */}
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                 {currentQuestion?.question}
//               </h2>

//               {/* Question Input based on type */}
//               <div className="mb-6">
//                 {currentQuestion?.type === "mcq" && (
//                   <div className="space-y-3">
//                     {currentQuestion.options?.map((option, idx) => (
//                       <label
//                         key={option._id}
//                         className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
//                       >
//                         <input
//                           type="radio"
//                           name={`question-${currentQuestion._id}`}
//                           value={option._id}
//                           checked={answers[currentQuestion._id] === option._id}
//                           onChange={(e) =>
//                             handleAnswerChange(
//                               currentQuestion._id,
//                               e.target.value,
//                             )
//                           }
//                           className="w-4 h-4 text-blue-600"
//                         />
//                         <span className="text-gray-900">{option.text}</span>
//                       </label>
//                     ))}
//                   </div>
//                 )}

//                 {currentQuestion?.type === "true_false" && (
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
//                       <input
//                         type="radio"
//                         name={`question-${currentQuestion._id}`}
//                         value="true"
//                         checked={answers[currentQuestion._id] === true}
//                         onChange={() =>
//                           handleAnswerChange(currentQuestion._id, true)
//                         }
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <span className="text-gray-900">True</span>
//                     </label>
//                     <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
//                       <input
//                         type="radio"
//                         name={`question-${currentQuestion._id}`}
//                         value="false"
//                         checked={answers[currentQuestion._id] === false}
//                         onChange={() =>
//                           handleAnswerChange(currentQuestion._id, false)
//                         }
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <span className="text-gray-900">False</span>
//                     </label>
//                   </div>
//                 )}

//                 {currentQuestion?.type === "fill_in_blanks" && (
//                   <input
//                     type="text"
//                     value={answers[currentQuestion._id] || ""}
//                     onChange={(e) =>
//                       handleAnswerChange(currentQuestion._id, e.target.value)
//                     }
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter your answer..."
//                   />
//                 )}

//                 {currentQuestion?.type === "writing" && (
//                   <textarea
//                     value={answers[currentQuestion._id] || ""}
//                     onChange={(e) =>
//                       handleAnswerChange(currentQuestion._id, e.target.value)
//                     }
//                     rows={8}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                     placeholder="Write your answer here..."
//                   />
//                 )}

//                 {currentQuestion?.type === "listening" && (
//                   <div className="space-y-4">
//                     <div className="bg-gray-100 rounded-lg p-4">
//                       <audio controls className="w-full">
//                         <source
//                           src={currentQuestion.audioFile}
//                           type="audio/mpeg"
//                         />
//                         Your browser does not support the audio element.
//                       </audio>
//                     </div>
//                     <p className="text-sm text-gray-600">
//                       Listen to the audio and answer the question above.
//                     </p>
//                   </div>
//                 )}

//                 {currentQuestion?.type === "speaking" && (
//                   <div className="space-y-4">
//                     <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
//                       <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
//                       <span>Start Recording</span>
//                     </button>
//                     <p className="text-sm text-gray-600">
//                       Click to start recording your answer.
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Navigation */}
//               <div className="flex items-center justify-between pt-6 border-t">
//                 <button
//                   onClick={goToPrevious}
//                   disabled={currentQuestionIndex === 0}
//                   className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronLeft size={20} />
//                   <span>Previous</span>
//                 </button>

//                 <button
//                   onClick={goToNext}
//                   disabled={currentQuestionIndex === questions.length - 1}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span>Next</span>
//                   <ChevronRight size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Question Navigation Panel */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-32">
//               <h3 className="font-semibold text-gray-900 mb-4">
//                 Question Navigator
//               </h3>
//               <div className="grid grid-cols-5 gap-2">
//                 {questions.map((q, idx) => (
//                   <button
//                     key={q._id}
//                     onClick={() => goToQuestion(idx)}
//                     className={`
//                       w-10 h-10 rounded-lg font-medium text-sm transition-colors
//                       ${
//                         currentQuestionIndex === idx
//                           ? "bg-blue-600 text-white"
//                           : answers[q._id]
//                             ? "bg-green-100 text-green-700 hover:bg-green-200"
//                             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }
//                     `}
//                   >
//                     {idx + 1}
//                   </button>
//                 ))}
//               </div>

//               <div className="mt-4 pt-4 border-t space-y-2">
//                 <div className="flex items-center gap-2 text-sm">
//                   <div className="w-4 h-4 bg-blue-600 rounded"></div>
//                   <span className="text-gray-600">Current</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <div className="w-4 h-4 bg-green-100 rounded"></div>
//                   <span className="text-gray-600">Answered</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <div className="w-4 h-4 bg-gray-100 rounded"></div>
//                   <span className="text-gray-600">Not Answered</span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setShowSubmitConfirm(true)}
//                 disabled={submitting}
//                 className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send size={20} />
//                 <span>Submit Exam</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Auto-submit warning */}
//       {autoSubmitWarning && (
//         <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
//           <AlertCircle size={24} />
//           <div>
//             <p className="font-semibold">Time Running Out!</p>
//             <p className="text-sm">
//               Exam will auto-submit in {formatTime(timeRemaining)}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Submit Confirmation Modal */}
//       {showSubmitConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Submit Exam?
//             </h2>
//             <div className="space-y-4">
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <div className="flex justify-between text-sm mb-2">
//                   <span className="text-gray-600">Questions Answered:</span>
//                   <span className="font-medium">
//                     {answeredCount}/{questions.length}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Progress:</span>
//                   <span className="font-medium">{Math.round(progress)}%</span>
//                 </div>
//               </div>

//               {answeredCount < questions.length && (
//                 <div className="flex items-start gap-2 text-yellow-700 bg-yellow-50 p-3 rounded-lg">
//                   <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
//                   <p className="text-sm">
//                     You have not answered all questions. Are you sure you want
//                     to submit?
//                   </p>
//                 </div>
//               )}

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowSubmitConfirm(false)}
//                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Continue Exam
//                 </button>
//                 <button
//                   onClick={submitExam}
//                   disabled={submitting}
//                   className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {submitting ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TakeExam;

import { useState, useEffect } from "react";
import {
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { studentAPI } from "../../utils/api";

const TakeExam = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [autoSubmitWarning, setAutoSubmitWarning] = useState(false);

  useEffect(() => {
    startExam();
  }, [applicationId]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 60) {
          setAutoSubmitWarning(true);
        }

        if (prev <= 1) {
          clearInterval(timer);
          autoSubmit();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // ==========================================
  // Start Exam
  // ==========================================

  const startExam = async () => {
    try {
      setLoading(true);

      const { data } = await studentAPI.startExam({ applicationId });

      if (!data?.success || !data?.exam) {
        throw new Error(data?.message || "Exam could not be started");
      }

      console.log("Exam start response:", data);
      console.log("Exam start debug:", data.debug);

      setExam(data.exam);
      setQuestions(data.questions || []);

      if (data.exam?.duration) {
        setTimeRemaining(data.exam.duration * 60);
      } else {
        setTimeRemaining(60 * 60);
      }
    } catch (error) {
      console.log(error);
      const backendMessage = error?.response?.data?.message;
      alert(backendMessage || "Unable to load exam");
      navigate("/student/all-tests");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Save Answer
  // ==========================================

  const saveAnswer = async (questionId, selectedOption) => {
    if (!exam?._id) return;

    try {
      await studentAPI.saveAnswer({
        examId: exam._id,
        questionId,
        answer: selectedOption,
        timeSpent: 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // Handle Answer
  // ==========================================

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));

    saveAnswer(questionId, selectedOption);
  };

  // ==========================================
  // Auto Submit
  // ==========================================

  const autoSubmit = async () => {
    if (!exam?._id) return;

    try {
      await studentAPI.autoSubmitExam(exam._id, {
        applicationId,
        answers,
      });

      alert("Time expired. Exam submitted.");
      navigate("/student/results");
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // Manual Submit
  // ==========================================

  const submitExam = async () => {
    try {
      setSubmitting(true);

      if (!exam?._id) {
        alert("Exam not loaded");
        return;
      }

      await studentAPI.submitExam(exam._id, { answers });

      alert("Exam submitted successfully.");
      navigate("/student/results");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Unable to submit exam.");
    } finally {
      setSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  // ==========================================
  // Navigation
  // ==========================================

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const answeredCount = Object.keys(answers).length;

  const progress =
    questions?.length || 0 ? (answeredCount / questions.length) * 100 : 0;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4">Loading Exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{exam?.test?.title}</h1>

            <p className="text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              autoSubmitWarning
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <Clock size={20} />

            <span className="font-bold font-mono">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Progress */}

        <div className="max-w-7xl mx-auto px-6 pb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>
              {answeredCount}/{questions.length} Answered
            </span>

            <span>{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Body */}

      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6 px-6 py-6">
        {/* Question */}

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                MCQ
              </span>

              <span className="font-semibold">
                Marks : {currentQuestion?.marks}
              </span>
            </div>

            <h2 className="text-2xl font-semibold mb-8">
              {currentQuestion?.question}
            </h2>

            {/* Options */}

            <div className="space-y-4">
              {currentQuestion?.options?.map((option, index) => (
                <label
                  key={option._id}
                  className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition

                  ${
                    answers[currentQuestion._id] === index
                      ? "border-blue-600 bg-blue-50"
                      : "hover:bg-gray-50"
                  }
                  `}
                >
                  <input
                    type="radio"
                    name={currentQuestion._id}
                    value={option._id}
                    checked={answers[currentQuestion._id] === option._id}
                    onChange={() =>
                      handleAnswerChange(currentQuestion._id, option._id)
                    }
                  />

                  <span className="text-lg">{option.text}</span>
                </label>
              ))}
            </div>

            {/* Navigation */}

            <div className="border-t mt-10 pt-6 flex justify-between">
              <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-5 py-2 border rounded-lg disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <button
                onClick={goToNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-40"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}

        <div>
          <div className="bg-white rounded-xl shadow p-5 sticky top-28">
            <h3 className="font-bold mb-5">Question Navigator</h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <button
                  key={q._id}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold

                  ${
                    currentQuestionIndex === index
                      ? "bg-blue-600 text-white"
                      : answers[q._id]
                        ? "bg-green-200"
                        : "bg-gray-200"
                  }

                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>

                <span className="text-sm">Current</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-300 rounded"></div>

                <span className="text-sm">Answered</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>

                <span className="text-sm">Not Answered</span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={submitting}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex justify-center items-center gap-2"
            >
              <Send size={18} />
              Submit Exam
            </button>
          </div>
        </div>
      </div>
      {/* Auto Submit Warning */}
      {autoSubmitWarning && (
        <div className="fixed bottom-5 right-5 bg-red-600 text-white rounded-lg shadow-xl px-6 py-4 flex items-center gap-3 z-50">
          <AlertCircle size={24} />

          <div>
            <p className="font-semibold">Time is almost over!</p>

            <p className="text-sm">Remaining: {formatTime(timeRemaining)}</p>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-5">Submit Exam?</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Answered</span>

                <span className="font-semibold">
                  {answeredCount}/{questions.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Progress</span>

                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
            </div>

            {answeredCount !== questions.length && (
              <div className="mt-5 bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-yellow-600" size={22} />

                <p className="text-sm text-yellow-700">
                  You haven't answered all questions. Are you sure you want to
                  submit?
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 border border-gray-300 rounded-lg py-3 hover:bg-gray-100"
              >
                Continue Exam
              </button>

              <button
                onClick={submitExam}
                disabled={submitting}
                className="flex-1 bg-green-600 text-white rounded-lg py-3 hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeExam;
