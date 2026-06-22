import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useState } from 'react';

import {
  getFeedbacks,
  reviewFeedback,
} from '../api/feedbackApi';

const AdminFeedbackPage = () => {
  const queryClient =
    useQueryClient();

    const [selectedFeedback, setSelectedFeedback] =
  useState(null);

  const { data = [] } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: getFeedbacks,
  });

  const reviewMutation =
    useMutation({
      mutationFn: reviewFeedback,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'feedbacks',
          ],
        });
      },
    });

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Feedback Management
        </h1>

        <p className="text-slate-500">
          User suggestions and
          platform feedback
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">

        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="p-3 text-left">
                User
              </th>

              <th className="p-3 text-left">
                Subject
              </th>
              <th className="p-3 text-left">
                View
              </th>
              

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {data.map(
              (feedback) => (
                <tr
                  key={
                    feedback._id
                  }
                  className="border-b"
                >

                  <td className="p-3">
                    {
                      feedback.user
                        ?.name
                    }
                  </td>

                  <td className="p-3">
                    {
                      feedback.subject
                    }
                  </td>
                  

                  <td className="p-3">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        feedback.status ===
                        'Reviewed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {
                        feedback.status
                      }
                    </span>

                  </td>

                  <td>
  <button
    onClick={() =>
      setSelectedFeedback(feedback)
    }
    className="rounded-lg bg-slate-700 px-3 py-1 text-white hover:bg-slate-800"
  >
    View
  </button>
</td>

                  <td className="p-3">

                    {feedback.status ===
                      'Pending' && (
                      <button
                        onClick={() =>
                          reviewMutation.mutate(
                            feedback._id
                          )
                        }
                        className="rounded-lg bg-blue-500 px-3 py-1 text-white"
                      >
                        Mark Reviewed
                      </button>
                    )}

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {selectedFeedback && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Feedback Details
        </h2>

        <button
          onClick={() =>
            setSelectedFeedback(null)
          }
          className="text-xl"
        >
          ✕
        </button>

      </div>

      <div className="mt-6 space-y-4">

        <p>
          <strong>User:</strong>{' '}
          {selectedFeedback.user?.name}
        </p>

        <p>
          <strong>Email:</strong>{' '}
          {selectedFeedback.user?.email}
        </p>

        <p>
          <strong>Subject:</strong>{' '}
          {selectedFeedback.subject}
        </p>

        <p>
          <strong>Status:</strong>{' '}
          {selectedFeedback.status}
        </p>

        <div>

          <p className="mb-2 font-semibold">
            Message
          </p>

          <div className="rounded-xl bg-slate-100 p-4">

            {selectedFeedback.message}

          </div>

        </div>

      </div>

    </div>

  </div>
)}

    </div>
  );
};

export default AdminFeedbackPage;