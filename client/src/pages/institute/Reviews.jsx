import { useState, useEffect } from "react";
import { Star, MessageSquare, Filter, Search, Trash2, Check, X } from "lucide-react";
import { instituteAPI } from "../../utils/api";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await instituteAPI.getReviews();
      if (response.data.success) {
        const formattedReviews = response.data.data.reviews.map((review) => ({
          id: review._id,
          studentName: `${review.student?.firstName || ""} ${review.student?.lastName || ""}`.trim() || review.student?.email || "Unknown",
          course: review.test?.title || "Unknown Course",
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.createdAt).toLocaleDateString(),
          isApproved: review.isApproved,
        }));
        setReviews(formattedReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await fetch(`http://localhost:5000/api/reviews/${reviewId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isApproved: true }),
      });
      fetchReviews();
    } catch (error) {
      console.error("Error approving review:", error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter = filter === "all" || 
      (filter === "5" && review.rating === 5) ||
      (filter === "4" && review.rating === 4) ||
      (filter === "3" && review.rating <= 3);
    
    const matchesSearch = review.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Reviews</h1>
        <p className="text-gray-600">View and manage student feedback</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars & Below</option>
            </select>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.studentName}</h3>
                    <p className="text-sm text-gray-600">{review.course}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{review.date}</p>
                  {!review.isApproved && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
