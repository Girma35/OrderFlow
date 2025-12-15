import { useState } from 'react';
import { Clock, MessageSquare, Plus } from 'lucide-react';
import { Order, Note } from '../../types/order';

interface TimelineTabProps {
  order: Order;
  onAddNote: (orderId: string, noteText: string) => void;
}

export function TimelineTab({ order, onAddNote }: TimelineTabProps) {
  const [noteText, setNoteText] = useState('');

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(order.id, noteText);
      setNoteText('');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const allEvents = [
    ...order.timeline.map((event) => ({
      type: 'timeline' as const,
      timestamp: event.timestamp,
      content: event.note || event.status,
      status: event.status,
    })),
    ...order.notes.map((note) => ({
      type: 'note' as const,
      timestamp: note.timestamp,
      content: note.text,
      author: note.author,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Order Timeline
        </h3>
        <div className="space-y-4">
          {allEvents.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                {event.type === 'timeline' ? (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">
                    {event.type === 'timeline' ? `Status: ${event.status}` : 'Internal Note'}
                  </p>
                  <span className="text-xs text-gray-500">{formatDate(event.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-700">{event.content}</p>
                {event.type === 'note' && (
                  <p className="text-xs text-gray-500 mt-2">By: {event.author}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Add Internal Note
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <label htmlFor="note-input" className="sr-only">
            Internal note
          </label>
          <textarea
            id="note-input"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note about this order..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
          />
          <button
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>

        {order.notes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Notes</h4>
            <div className="space-y-2">
              {order.notes.slice(0, 3).map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-700">{note.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(note.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
