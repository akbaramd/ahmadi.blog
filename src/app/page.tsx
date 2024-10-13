
import MainSidebar from "./main-sidebar";
import { getPosts} from "@/lib/posts";
import Link from "next/link"; // Import the function to get (posts)



export default async function SettingsProfilePage() {
    // Fetch the session
    // Fetch all (posts)
    const posts = await getPosts();

    return (
        <div className="container mx-auto my-4 flex flex-col lg:flex-row gap-6">
            {/* Reusable Sidebar */}
            <MainSidebar />

            {/* Main content area */}
            <main className="lg:w-3/4 w-full bg-white shadow-sm p-6 rounded-md">
                <h3 className="text-lg font-medium">پروفایل</h3>
                <p className="mt-4 text-gray-700">محتوای پروفایل شما در اینجا قرار می‌گیرد.</p>

                {/* Display all (posts) */}
                <h4 className="mt-6 text-lg font-semibold">مقالات</h4>
                <ul className="mt-4 space-y-4">
                    {posts.map(post => (
                        <li key={post.slug} className="p-4 border rounded-md shadow-sm bg-gray-50">
                            <h5 className="text-md font-bold">{post.slug}</h5>
                            <p className="text-sm text-gray-600">{post.slug}</p>
                            <Link href={`/posts/${post.slug}`} className="text-blue-500 hover:underline">
                                ادامه مطلب
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
