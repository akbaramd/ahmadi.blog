"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
    id: number;
    name: string;
    title: string;
}

// Component to handle the categories.tsx
export default function CategoriesList() {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false); // For edit modal
    const [confirmOpen, setConfirmOpen] = useState(false); // For delete confirmation modal
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Single input for search
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); // Store category being edited or deleted
    const { toast } = useToast();
    const parentRef = useRef<HTMLDivElement>(null);

    // Fetch categories.tsx with combined search on name and title
    const { data: categories, fetchNextPage, hasNextPage, refetch } = api.category.getAllInfinite.useInfiniteQuery(
        {
            name: searchTerm,
            title: searchTerm,
            limit: 10, // Limit per page
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const createCategory = api.category.create.useMutation({
        onSuccess: async () => {
            await refetch(); // Refetch categories.tsx after adding a new one
            toast({ title: "دسته‌بندی جدید با موفقیت اضافه شد!" });
            setOpen(false); // Close modal on success
        },
        onError: (error) => {
            toast({ title: "خطا در افزودن دسته‌بندی", description: error.message });
        },
    });

    const updateCategory = api.category.update.useMutation({
        onSuccess: async () => {
            await refetch(); // Refetch categories.tsx after updating
            toast({ title: "دسته‌بندی با موفقیت به‌روزرسانی شد!" });
            setEditOpen(false); // Close modal on success
        },
        onError: (error) => {
            toast({ title: "خطا در به‌روزرسانی دسته‌بندی", description: error.message });
        },
    });

    const deleteCategory = api.category.delete.useMutation({
        onSuccess: async () => {
            await refetch(); // Refetch categories.tsx after deletion
            toast({ title: "دسته‌بندی با موفقیت حذف شد!" });
            setConfirmOpen(false); // Close modal on success
        },
        onError: (error) => {
            toast({ title: "خطا در حذف دسته‌بندی", description: error.message });
        },
    });

    // Handle adding a category
    const handleAddCategory = () => {
        createCategory.mutate({ name, title });
    };

    // Handle updating a category
    const handleEditCategory = () => {
        if (selectedCategory) {
            updateCategory.mutate({ id: selectedCategory.id, name, title });
        }
    };

    // Handle deleting a category
    const handleDeleteCategory = () => {
        if (selectedCategory) {
            deleteCategory.mutate({ id: selectedCategory.id });
        }
    };

    // Virtualizer setup for efficient list rendering
    const rowVirtualizer = useVirtualizer({
        count: categories?.pages.reduce((total, page) => total + page.categories.length, 0) ?? 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100, // Estimated row height
        overscan: 5, // Load extra items around the current view
    });

    return (
        <div>
            <h2 className="text-lg font-semibold">دسته‌بندی‌ها</h2>
            <Separator className="my-4" />

            {/* Button to open the modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)}>اضافه کردن دسته‌بندی جدید</Button>
                </DialogTrigger>

                {/* Modal content for adding category */}
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>اضافه کردن دسته‌بندی جدید</DialogTitle>
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
                    <Button onClick={handleAddCategory} disabled={createCategory.isPending}>
                        {createCategory.isPending ? "در حال افزودن..." : "افزودن"}
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Search input */}
            <div className="space-y-4 my-4">
                <Input
                    placeholder="جستجو بر اساس نام یا عنوان"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                />
                <Button onClick={() => refetch()}>جستجو</Button>
            </div>

            {/* List of categories.tsx in a card layout with virtualization */}
            <div ref={parentRef} className="h-[400px] overflow-y-auto">
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const pageIndex = Math.floor(virtualRow.index / 10);
                        const categoryIndex = virtualRow.index % 10;
                        const category = categories?.pages[pageIndex]?.categories[categoryIndex];

                        if (!category) return null;

                        return (
                            <Card key={category.id} className={"mb-2"}>
                                <CardContent className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg m-0 font-semibold">{category.name}</h3>
                                        <p className="text-sm">{category.title}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* Edit Button */}
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setName(category.name);
                                                setTitle(category.title);
                                                setEditOpen(true);
                                            }}
                                        >
                                            ویرایش
                                        </Button>
                                        {/* Delete Button */}
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setConfirmOpen(true);
                                            }}
                                        >
                                            حذف
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Infinite Scroll */}
            {hasNextPage && (
                <Button onClick={() => fetchNextPage()} className="mt-4">
                    بارگذاری بیشتر
                </Button>
            )}

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
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
                    <Button onClick={handleEditCategory} disabled={updateCategory.isPending}>
                        {updateCategory.isPending ? "در حال به‌روزرسانی..." : "به‌روزرسانی"}
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>آیا مطمئن هستید که می‌خواهید حذف کنید؟</DialogTitle>
                    </DialogHeader>
                    <Button variant="destructive" onClick={handleDeleteCategory} disabled={deleteCategory.isPending}>
                        {deleteCategory.isPending ? "در حال حذف..." : "حذف"}
                    </Button>
                    <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                        انصراف
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
