"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { GlobalState } from "@/redux/reducers";
import { useEffect, useState } from "react";
import { fetchPostByUser } from "@/redux/sagas/post/fetchPostByUser";
import { format, parseISO } from "date-fns";
import { Avatar, Tag } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { IPostRes } from "@/types/post/postRes";
const LIMIT = 2;
export default function Home() {
  const { postUser } = useAppSelector((state: GlobalState) => state.postState);
  const dispatch = useAppDispatch();
  const [isReadMore, setIsReadMore] = useState(true);
  const [isShowRep, setIsShowRep] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<IPostRes[]>([]);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const toggleShowRep = () => {
    setIsShowRep(!isShowRep);
  };
  useEffect(() => {
    if (postUser && items.length < LIMIT) {
      setItems(postUser.posts);
    }
  }, [postUser, items]);

  useEffect(() => {
    dispatch(fetchPostByUser({ page, limit: LIMIT }));
  }, [dispatch, page]);

  const fetchDataPost = () => {
    if (postUser) {
      if (items.length >= postUser.total) {
        setHasMore(false);
      } else {
        setPage(page + 1);
        setItems((prevItems) => [...prevItems, ...postUser.posts]);
      }
    }
  };
  return (
    <div className="min-h-screen p-24">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchDataPost}
        hasMore={hasMore}
        loader={<div>...loading</div>}
        endMessage={<div className="text-center">Het</div>}
      >
        <div>
          {items.map((post) => {
            return (
              <div key={post.id} className=" w-full mb-[80px]">
                <div className="text-xl font-semibold text-center">
                  {post.title}
                </div>
                <div className="flex justify-between">
                  <div>
                    <span>Author: {post.user.fullName}</span>
                    <div>
                      CreatedAt:{" "}
                      {format(parseISO(post?.createdDate), "dd-MM-yyyy")}
                    </div>
                  </div>
                  <div>
                    {post.tags?.map((tag) => {
                      return (
                        <Tag key={tag.id} color="magenta">
                          {tag.name}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
                <div
                  className={`${
                    isReadMore
                      ? "align-text-top break-words max-h-[330px] overflow-hidden "
                      : "align-text-top break-words "
                  }text-gray-500 text-[15px]`}
                >
                  {post.content && isReadMore
                    ? post.content.slice(0, 500)
                    : post.content}
                  {post.content && post.content.length > 500 && (
                    <span
                      onClick={toggleReadMore}
                      className="underline capitalize font-semibold text-[14px] ml-1"
                    >
                      {isReadMore ? " Read More" : " Hide"}
                    </span>
                  )}
                </div>
                <div>
                  {post.comment.map((item) => {
                    return (
                      <div key={item.id} className="mt-5">
                        <div onClick={toggleShowRep} className="cursor-pointer">
                          {post.comment.length} replies
                        </div>
                        <div className="w-full border-2 bg-black" />
                        {isShowRep ? (
                          <div className="flex items-center gap-3 ml-3 mt-4">
                            <Avatar style={{ backgroundColor: "#f56a00" }}>
                              K
                            </Avatar>
                            <div>
                              <div className="text-gray-400">
                                {format(
                                  parseISO(item?.createdDate),
                                  "dd-MM-yyyy",
                                )}
                              </div>
                              <span>{item.content}</span>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
      <div className="h-[300px]" />
    </div>
  );
}
