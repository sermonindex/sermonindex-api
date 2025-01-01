-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateEnum
CREATE TYPE "ContributorType" AS ENUM ('INDIVIDUAL', 'CONFERENCE');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('AUDIO', 'VIDEO', 'TEXT');

-- CreateEnum
CREATE TYPE "MediaSource" AS ENUM ('ARCHIVE', 'YOUTUBE', 'BUNNY');

-- CreateTable
CREATE TABLE "ChapterVerseSummary" (
    "language" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "ChapterVerseSummary_pkey" PRIMARY KEY ("language","bookId","chapterNumber","verseNumber")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "licenseUrl" TEXT NOT NULL,
    "shortName" TEXT,
    "englishName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "textDirection" TEXT NOT NULL,
    "sha256" TEXT,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commentary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "licenseUrl" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "textDirection" TEXT NOT NULL,
    "sha256" TEXT,

    CONSTRAINT "Commentary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputFile" (
    "translationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "sizeInBytes" INTEGER NOT NULL,

    CONSTRAINT "InputFile_pkey" PRIMARY KEY ("translationId","name")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,
    "sha256" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("translationId","id")
);

-- CreateTable
CREATE TABLE "CommentaryBook" (
    "id" TEXT NOT NULL,
    "commentaryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "introduction" TEXT,
    "order" INTEGER NOT NULL,
    "numberOfChapters" INTEGER NOT NULL,
    "sha256" TEXT,

    CONSTRAINT "CommentaryBook_pkey" PRIMARY KEY ("commentaryId","id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "sha256" TEXT,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("translationId","bookId","number")
);

-- CreateTable
CREATE TABLE "CommentaryChapter" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "commentaryId" TEXT NOT NULL,
    "introduction" TEXT,
    "json" TEXT NOT NULL,
    "sha256" TEXT,

    CONSTRAINT "CommentaryChapter_pkey" PRIMARY KEY ("commentaryId","bookId","number")
);

-- CreateTable
CREATE TABLE "ChapterAudioUrl" (
    "number" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "reader" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ChapterAudioUrl_pkey" PRIMARY KEY ("translationId","bookId","number","reader")
);

-- CreateTable
CREATE TABLE "ChapterVerse" (
    "number" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "contentJson" TEXT NOT NULL,
    "sha256" TEXT,

    CONSTRAINT "ChapterVerse_pkey" PRIMARY KEY ("translationId","bookId","chapterNumber","number")
);

-- CreateTable
CREATE TABLE "CommentaryChapterVerse" (
    "number" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "commentaryId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "contentJson" TEXT NOT NULL,
    "sha256" TEXT,

    CONSTRAINT "CommentaryChapterVerse_pkey" PRIMARY KEY ("commentaryId","bookId","chapterNumber","number")
);

-- CreateTable
CREATE TABLE "ChapterFootnote" (
    "id" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sha256" TEXT,
    "verseNumber" INTEGER,

    CONSTRAINT "ChapterFootnote_pkey" PRIMARY KEY ("translationId","bookId","chapterNumber","id")
);

-- CreateTable
CREATE TABLE "Contributor" (
    "id" SERIAL NOT NULL,
    "fullName" CITEXT NOT NULL,
    "fullNameSlug" CITEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "type" "ContributorType" NOT NULL DEFAULT 'INDIVIDUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributorImage" (
    "id" SERIAL NOT NULL,
    "originalId" INTEGER,
    "contributorId" INTEGER NOT NULL,
    "url" CITEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "takenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributorImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "name" CITEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Sermon" (
    "id" SERIAL NOT NULL,
    "originalId" TEXT,
    "contributorId" INTEGER NOT NULL,
    "title" CITEXT NOT NULL,
    "description" TEXT,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "previouslyFeatured" BOOLEAN NOT NULL DEFAULT false,
    "preachedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sermon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SermonUrl" (
    "id" SERIAL NOT NULL,
    "type" "MediaType" NOT NULL,
    "source" "MediaSource" NOT NULL,
    "sermonId" INTEGER NOT NULL,
    "url" CITEXT NOT NULL,

    CONSTRAINT "SermonUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SermonBibleReference" (
    "id" SERIAL NOT NULL,
    "bookId" CITEXT NOT NULL,
    "startChapter" INTEGER,
    "endChapter" INTEGER,
    "startVerse" INTEGER,
    "endVerse" INTEGER,
    "text" TEXT NOT NULL,
    "sermonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SermonBibleReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SermonText" (
    "id" SERIAL NOT NULL,
    "sermonId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SermonText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SermonToTopic" (
    "A" INTEGER NOT NULL,
    "B" CITEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_fullName_key" ON "Contributor"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sermon_title_contributorId_key" ON "Sermon"("title", "contributorId");

-- CreateIndex
CREATE UNIQUE INDEX "SermonText_sermonId_key" ON "SermonText"("sermonId");

-- CreateIndex
CREATE UNIQUE INDEX "_SermonToTopic_AB_unique" ON "_SermonToTopic"("A", "B");

-- CreateIndex
CREATE INDEX "_SermonToTopic_B_index" ON "_SermonToTopic"("B");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaryBook" ADD CONSTRAINT "CommentaryBook_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book"("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaryChapter" ADD CONSTRAINT "CommentaryChapter_commentaryId_bookId_fkey" FOREIGN KEY ("commentaryId", "bookId") REFERENCES "CommentaryBook"("commentaryId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaryChapter" ADD CONSTRAINT "CommentaryChapter_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAudioUrl" ADD CONSTRAINT "ChapterAudioUrl_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book"("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAudioUrl" ADD CONSTRAINT "ChapterAudioUrl_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterAudioUrl" ADD CONSTRAINT "ChapterAudioUrl_translationId_bookId_number_fkey" FOREIGN KEY ("translationId", "bookId", "number") REFERENCES "Chapter"("translationId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterVerse" ADD CONSTRAINT "ChapterVerse_translationId_bookId_chapterNumber_fkey" FOREIGN KEY ("translationId", "bookId", "chapterNumber") REFERENCES "Chapter"("translationId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterVerse" ADD CONSTRAINT "ChapterVerse_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book"("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterVerse" ADD CONSTRAINT "ChapterVerse_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaryChapterVerse" ADD CONSTRAINT "CommentaryChapterVerse_commentaryId_bookId_chapterNumber_fkey" FOREIGN KEY ("commentaryId", "bookId", "chapterNumber") REFERENCES "CommentaryChapter"("commentaryId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaryChapterVerse" ADD CONSTRAINT "CommentaryChapterVerse_commentaryId_bookId_fkey" FOREIGN KEY ("commentaryId", "bookId") REFERENCES "CommentaryBook"("commentaryId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaryChapterVerse" ADD CONSTRAINT "CommentaryChapterVerse_commentaryId_fkey" FOREIGN KEY ("commentaryId") REFERENCES "Commentary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterFootnote" ADD CONSTRAINT "ChapterFootnote_translationId_bookId_chapterNumber_fkey" FOREIGN KEY ("translationId", "bookId", "chapterNumber") REFERENCES "Chapter"("translationId", "bookId", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterFootnote" ADD CONSTRAINT "ChapterFootnote_translationId_bookId_fkey" FOREIGN KEY ("translationId", "bookId") REFERENCES "Book"("translationId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterFootnote" ADD CONSTRAINT "ChapterFootnote_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterFootnote" ADD CONSTRAINT "ChapterFootnote_translationId_bookId_chapterNumber_verseNu_fkey" FOREIGN KEY ("translationId", "bookId", "chapterNumber", "verseNumber") REFERENCES "ChapterVerse"("translationId", "bookId", "chapterNumber", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributorImage" ADD CONSTRAINT "ContributorImage_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sermon" ADD CONSTRAINT "Sermon_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SermonUrl" ADD CONSTRAINT "SermonUrl_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "Sermon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SermonBibleReference" ADD CONSTRAINT "SermonBibleReference_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "Sermon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SermonText" ADD CONSTRAINT "SermonText_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "Sermon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SermonToTopic" ADD CONSTRAINT "_SermonToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "Sermon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SermonToTopic" ADD CONSTRAINT "_SermonToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("name") ON DELETE CASCADE ON UPDATE CASCADE;
