import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

import {
  deleteEvent,
  updateEvent,
  EventType,
  EventColor,
  type Event,
} from '@/api/event';

const updateFormSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Event name is required'),
  date: z.string().refine((date) => {
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }, { message: 'Event date must not be in the past' }),
  description: z.string().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  type: z.nativeEnum(EventType),
}).refine((data) => {
  // Ensure startTime is before endTime
  const [startHour, startMinute] = data.startTime.split(':').map(Number);
  const [endHour, endMinute] = data.endTime.split(':').map(Number);
  const start = new Date(0, 0, 0, startHour, startMinute);
  const end = new Date(0, 0, 0, endHour, endMinute);
  return start < end;
}, {
  message: 'Start time must be before end time',
  path: ['endTime'],
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

const UpdateForm: React.FC<{ event: Event, onClose: () => void }> = ({ event, onClose }) => {
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      id: event.id,
      name: event.name,
      date: event.date,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type,
    },
  });

  const onSubmit = (values: UpdateFormValues) => {
    const updatedEvent: Event = {
      ...values,
      color: EventColor[values.type],
      date: new Date(values.date).toISOString().split('T')[0],
      description: values.description || '',
    };
    try {
      updateEvent(event.id, updatedEvent);
      form.reset();
      onClose();
    } catch {
      alert('Event conflicts with an existing event.');
    }
  };

  const onDelete = () => {
    deleteEvent(event.id);
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Event Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Time */}
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Time */}
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value as EventType)}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EventType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="submit">Update Event</Button>
          <Button type="button" variant="destructive" onClick={onDelete}>Delete Event</Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateForm;