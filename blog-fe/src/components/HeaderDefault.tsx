"use client";

import Link from "next/link";
import { HiOutlineUserCircle } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalState } from "@/redux/reducers";
import { Button, message } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { systemUserSlicesActions } from "@/redux/reducers/slices/systemAuthSlice";
import { logoutApi } from "@/api-client/auth/logout.api";

function HeaderDefault() {
  const [active, setActive] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { systemUser } = useAppSelector(
    (state: GlobalState) => state.authState,
  );
  const router = useRouter();
  const { isLoggedIn } = useAppSelector(
    (state: GlobalState) => state.authState,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  const handleLogout = async () => {
    try {
      const res = await logoutApi();
      if (res) {
        dispatch(
          systemUserSlicesActions.updateIsLoggedIn({ isLoggedIn: false }),
        );
        dispatch(
          systemUserSlicesActions.updateSystemUser({ systemUser: null }),
        );
        messageApi.success("Đăng xuất thành công", 1);
        router.push("/auth/login");
      }
    } catch (err: any) {
      messageApi.error(err.message, 1);
      if (err.status === 401) router.push("/auth/login");
    }
  };

  return (
    <header
      className={`${
        active ? "bg-gray-50 py-2 w-full fixed shadow-xl" : "relative"
      } transition ease-in-out delay-600 px-20 z-[9999] flex justify-between lg:gap-x-2 items-center top-0 left-0 w-[100%]`}
    >
      <div className=" gap-x-4 items-center flex">
        <div className="block lg:hidden"></div>
        <div className=" hidden lg:flex lg:gap-x-4">
          {systemUser?.fullName}
          <HiOutlineUserCircle
            size={25}
            className="cursor-pointer dark:text-white text-black "
          />
        </div>
        <div>
          {!isLoggedIn ? (
            <Button className="px-[40px] py-3 border-[2px] rounded-xl bg-white border-black">
              Đăng nhập
            </Button>
          ) : (
            <Button
              className="px-[40px] py-3 border-[2px] rounded-xl bg-white border-black"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          )}
        </div>
      </div>
      {contextHolder}
    </header>
  );
}
export default HeaderDefault;
