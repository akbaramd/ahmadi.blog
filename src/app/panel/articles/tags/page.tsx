// app/settings/profile/tags.tsx
"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import {api} from "@/trpc/react";

export default function TagsList() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterTitle, setFilterTitle] = useState('');

  const { data: tags, refetch } = api.tag.getAll.useQuery({
    name: filterName,
    title: filterTitle,
  });

  const createTag = api.tag.create.useMutation({
    onSuccess: async () => {
      await refetch(); // Refetch tags after adding a new one
      toast({ title: 'تگ جدید با موفقیت اضافه شد!' });
      setOpen(false);
    },
    onError: (error) => {
      toast({ title: 'خطا در افزودن تگ', description: error.message });
    },
  });

  const handleAddTag = () => {
    createTag.mutate({ name, title });
  };

  return (
      <div>
        <h2 className="text-lg font-semibold">تگ‌ها</h2>
        <Separator className="my-4" />

        {/* Button to open the modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>اضافه کردن تگ جدید</Button>
          </DialogTrigger>

          {/* Modal content for adding tag */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>اضافه کردن تگ جدید</DialogTitle>
            </DialogHeader>
            <Input
                placeholder="نام (انگلیسی)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
            />
            <Input
                placeholder="عنوان (فارسی)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
            />
            <Button onClick={handleAddTag}>افزودن</Button>
          </DialogContent>
        </Dialog>

        {/* Search inputs */}
        <div className="space-y-4 my-4">
          <Input
              placeholder="جستجو بر اساس نام (انگلیسی)"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="mb-2"
          />
          <Input
              placeholder="جستجو بر اساس عنوان (فارسی)"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              className="mb-4"
          />
          <Button onClick={() => refetch()}>جستجو</Button>
        </div>

        {/* List of tags */}
        <div className="space-y-4">
          {tags?.map((tag) => (
              <div key={tag.id}>
                <p>{tag.title} ({tag.name})</p>
              </div>
          ))}
        </div>
      </div>
  );
}
