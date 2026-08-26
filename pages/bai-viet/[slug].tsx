import { GetServerSideProps, NextPage } from "next";
import React, { useMemo } from "react";
import parse from "html-react-parser";
import DefaultLayout from "../../components/layout/DefaultLayout";
import db from "../../utils/db";
import Post from "../../models/Post";
import Share from "../../components/common/Share";
import Link from "next/link";
import Image from "next/image";
import { trimText, extractHeadingsAndInjectIds } from "../../utils/helper";
import { TableOfContents } from "../../components/common/TableOfContents";
import ArticleImageGallery, {
  parseArticleGalleryImages,
} from "../../components/common/ArticleImageGallery";

type PostData = {
  id: string;
  title: string;
  content: string;
  meta: string;
  tags: string[];
  slug: string;
  thumbnail: string;
  createdAt: string;
  category: string;
  authorName?: string;
  authorBio?: string;
  authorAvatar?: string;
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail?: string;
    createdAt: string;
  }[];
};

type MetaData = {
  title: string;
  description: string;
  author: string;
  canonical: string;
  og: {
    title: string;
    description: string;
    type: string;
    image: string;
    imageWidth: string;
    imageHeight: string;
    url: string;
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
};

type Props = {
  post: PostData;
  meta: MetaData;
};

const host = "https://btacademy.com.vn/bai-viet";
export const APP_NAME = "BT Academy";

const SinglePost: NextPage<Props> = ({ post }) => {
  if (!post) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-md">
            <p className="font-medium text-lg">Bài viết không khả dụng</p>
            <p className="text-sm mt-1 text-red-500">Nội dung bài viết chưa được cập nhật hoặc không tồn tại.</p>
            <Link href="/" className="mt-4 inline-block px-4 py-2 bg-[#105d97] text-white rounded-lg hover:bg-[#0d4c7a] transition">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const { title, content, slug, recentPosts, category, createdAt, authorName, authorAvatar, authorBio } = post;

  const { processedHtml, headings } = useMemo(() => {
    return extractHeadingsAndInjectIds(content);
  }, [content]);

  const parseOptions = {
    replace(domNode: any) {
      if (
        domNode.type === "tag" &&
        domNode.attribs?.["data-article-gallery"] === "true"
      ) {
        return (
          <ArticleImageGallery
            images={parseArticleGalleryImages(domNode.attribs["data-images"])}
            title={domNode.attribs["data-title"] || "Thư viện hình ảnh"}
          />
        );
      }

      if (
        domNode.type === "tag" &&
        domNode.name === "img" &&
        domNode.attribs?.["data-caption"] &&
        domNode.parent?.name !== "figure"
      ) {
        const { class: className, style, ...attribs } = domNode.attribs;
        const caption = attribs["data-caption"];
        return (
          <figure className="image-caption-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img className={className || ""} {...attribs} />
            <figcaption>{caption}</figcaption>
          </figure>
        );
      }
    },
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 ">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white dark:bg-gray-800 ">
                {/* Breadcrumb UI */}
                <nav aria-label="Breadcrumb" className="mb-4">
                  <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <li>
                      <Link href="/bai-viet" className="hover:text-[#105d97] transition-colors">
                        Bài viết
                      </Link>
                    </li>
                    <li><span className="text-gray-400">/</span></li>
                    <li className="text-gray-800 dark:text-gray-200 font-medium" aria-current="page">
                      {trimText(title, 40)}
                    </li>
                  </ol>
                </nav>

                {/* Article Header */}
                <div className="md:mb-6 mb-3 border-b border-gray-100 dark:border-gray-700 pb-5">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-4">
                    {title}
                  </h1>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      {category && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#105d97] dark:bg-blue-900/30 dark:text-blue-300">
                          {category}
                        </span>
                      )}
                      <span>
                        {new Date(createdAt).toLocaleDateString("vi-VN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <Share url={`${host}/${slug}`} />
                  </div>
                </div>

                {headings.length > 0 && <TableOfContents headings={headings} />}

                {/* Article Content */}
                <div className="prose blog prose-base md:prose-lg max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert">
                  <style jsx>{`
                    .blog :global(img) { display: block; margin: 1.5em auto; border-radius: 0.5rem; }
                    .blog :global(figure) { margin: 1.5em 0; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                    .blog :global(figure img) { display: block; margin: 0 auto; }
                    .blog :global(figcaption) { margin-top: 0.5rem; font-size: 0.875em; color: #6b7280; font-style: italic; text-align: center; width: 100%; max-width: 100%; }
                    :global(.dark) .blog :global(figcaption) { color: #9ca3af; }
                    .blog :global(table) { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; width: max-content !important; margin: 1.5em auto !important; border-collapse: collapse; border: 1px solid #d1d5db; }
                    .blog :global(td), .blog :global(th) { padding: 0.5em 0.75em; border: 1px solid #d1d5db; text-align: left; vertical-align: top; }
                    .blog :global(th) { background-color: #f3f4f6; font-weight: 600; color: #111827; }
                    .blog :global(td p), .blog :global(th p) { text-align: left !important; margin: 0; }
                    .blog :global(h1), .blog :global(h2), .blog :global(h3), .blog :global(h4), .blog :global(h5), .blog :global(h6) { scroll-margin-top: 100px; }
                  `}</style>
                  {parse(processedHtml, parseOptions)}
                </div>

                {/* Author Card */}
                {authorName && (
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-8 mt-12">
                    <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150 dark:border-gray-700">
                      {authorAvatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={authorAvatar}
                          alt={authorName}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#105d97] flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          Tác giả: {authorName}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                          {authorBio || "Chuyên gia chia sẻ kiến thức hữu ích tại BT Academy."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 lg:flex-shrink-0 w-full">
              <div className="sticky top-24 space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-2">
                  <h3 className="text-xs font-bold text-[#105d97] uppercase tracking-[0.15em] mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                    Bài viết gần đây
                  </h3>
                  <div className="space-y-2">
                    {recentPosts.slice(0, 5).map((p) => (
                      <Link key={p.slug} href={`/bai-viet/${p.slug}`} className="block group">
                        <div className="flex gap-3 p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                          {p.thumbnail && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={p.thumbnail}
                              alt={p.title}
                              className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#105d97] transition-colors line-clamp-2 leading-snug">
                              {p.title}
                            </h4>
                            {p.createdAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(p.createdAt).toLocaleDateString("vi-VN", {
                                  day: "numeric",
                                  month: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SinglePost;

export const getServerSideProps: GetServerSideProps<
  { post: PostData; meta: MetaData },
  { slug: string }
> = async ({ params }) => {
  try {
    await db.connectDb();

    const notDeletedAndNotDraftFilter = {
      isDraft: { $ne: true },
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    };

    const post = await Post.findOne({
      slug: params?.slug,
      ...notDeletedAndNotDraftFilter,
    }).populate("author");

    if (!post) {
      console.log(`Post not found for slug: ${params?.slug}`);
      return { notFound: true };
    }

    const posts = await Post.find({
      _id: { $ne: post._id },
      ...notDeletedAndNotDraftFilter,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("slug title thumbnail category createdAt");

    const recentPosts = posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      category: p.category || "Uncategorized",
      thumbnail: p.thumbnail?.url,
      createdAt: p.createdAt ? p.createdAt.toString() : "",
    }));

    const { _id, title, content, meta, slug, tags, thumbnail, category, createdAt, author } = post;

    const populatedAuthor = author as any;
    const authorName = populatedAuthor?.name || "";
    const authorBio = populatedAuthor?.bio || "";
    const authorAvatar = populatedAuthor?.avatar?.url || "";

    const metaData: MetaData = {
      title,
      description: meta,
      author: authorName || "BT Academy",
      canonical: `https://btacademy.com.vn/bai-viet/${slug}`,
      og: {
        title,
        description: meta,
        type: "website",
        image: thumbnail?.url || "/images/noi-that-1.jpg",
        imageWidth: "1200",
        imageHeight: "630",
        url: `https://btacademy.com.vn/bai-viet/${slug}`,
        siteName: "BT Academy",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: meta,
        image: thumbnail?.url || "/images/noi-that-1.jpg",
      },
    };

    const postData: PostData = {
      id: _id.toString(),
      title,
      content,
      meta,
      slug,
      tags,
      category,
      thumbnail: thumbnail?.url || "",
      createdAt: createdAt.toString(),
      authorName,
      authorBio,
      authorAvatar,
      recentPosts,
    };

    return {
      props: {
        post: postData,
        meta: metaData,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
};