/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 14:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-23 11:07:56
 * @Description: 登录页
 */
"use client";
import { useRouter } from '@bprogress/next/app';
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Eye, EyeOff, Lock, Mail, OctagonAlert, TriangleAlert } from 'lucide-react'
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form"
import { toast } from 'sonner';
import { z } from "zod"

import { RippleButton } from "@/components/animate-ui/components/buttons/ripple";
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input, InputWrapper } from "@/components/ui/input"
import { Spinner } from '@/components/ui/spinner';
import { OAUTH_PROVIDERS } from '@/enums';
import { GithubIcon, GoogleIcon } from '@/lib/icons'
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function Login() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [emailLoading, setEmailLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  // 是否注册
  const [isSignup, setIsSignup] = useState(false);
  // 是否显示密码
  const [showPassword, setShowPassword] = useState(false);

  // 字段验证规则
  const formSchema = z.object({
    email: z.email('请输入有效的邮箱地址'),
    password: z
      .string("请输入长度为6-12的字符串.")
      .min(6, "密码长度至少为6个字符")
      .max(12, "密码长度不能超过12个字符")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        '密码必须包含大小写字母和数字'
      )
  })

  // 创建表单实例
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  // 表单提交
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setEmailLoading(true);

    // ✅ 提取公共 Supabase 调用逻辑
    const authPromise = (async () => {
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp(values);
      } else {
        result = await supabase.auth.signInWithPassword(values);
      }

      if (result.error) {
        throw result.error; // 统一抛出错误
      }
      return result.data;
    })();

    // ✅ Toast 配置根据 action 动态生成
    const toastConfig = {
      loading: isSignup ? '注册中...' : '登录中...',
      success: () => {
        if (isSignup) {
          form.reset();
          setIsSignup(false);
          return '提交成功，请到邮箱验证后登录"';
        } else {
          router.refresh();
          return '登录成功，欢迎回来！';
        }
      },
      error: (err: { message: string }) => `${isSignup ? '注册失败，请稍后重试' : '登录失败，请稍后重试'}：${err.message}`,
      // ✅ 使用 finally 确保 loading 状态正确关闭
      finally: () => {
        setEmailLoading(false);
      }
    };

    toast.promise(authPromise, toastConfig);
  };

  // 谷歌或者 Github 登录
  const handleOAuthLogin = async (provider: typeof OAUTH_PROVIDERS.valueType) => {
    setOauthLoading(true);
    // 加一个短提示，避免跳转等待时间过长无反馈
    toast.custom(
      (id) => (
        <Alert appearance="outline" onClose={() => toast.dismiss(id)}>
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertTitle>登录中...</AlertTitle>
        </Alert>
      ),
      {
        duration: 2000,
      },
    )

    // 错误提示
    const errorToast = (msg: string) => {
      toast.custom(
        (id) => (
          <Alert variant="destructive" appearance="outline" onClose={() => toast.dismiss(id)}>
            <AlertIcon>
              <OctagonAlert />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>登录失败，请稍后重试</AlertTitle>
              <AlertDescription>{msg}</AlertDescription>
            </AlertContent>
          </Alert>
        )
      )
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      if (error) {
        errorToast(error.message)
        setOauthLoading(false);
      }
    } catch (err) {
      errorToast((err as Error).message)
      setOauthLoading(false);
    }
  }
  return (
    <div className="flex justify-center items-center flex-1">
      <Card className="w-lg max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/logo.svg"
              width={42}
              height={42}
              alt="Logo"
              className="rounded-lg"
            />
            <div className="flex flex-col">
              <p className="text-lg font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</p>
              <p className="text-sm text-default-500">从这里开始，马上登录！</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      <span className="text-red-500">*</span>
                      邮箱地址
                    </FieldLabel>
                    <InputWrapper>
                      <Mail />
                      <Input placeholder='请输入邮箱地址' {...field} />
                    </InputWrapper>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      <span className="text-red-500">*</span>
                      密码
                    </FieldLabel>
                    <InputWrapper>
                      <Lock />
                      <Input placeholder='请输入密码' type={showPassword ? 'text' : 'password'} {...field} />
                      <div onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                      </div>
                    </InputWrapper>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <RippleButton type="submit" disabled={oauthLoading || emailLoading} className="w-full">
                {emailLoading ? <Spinner /> : <Check />}
                {emailLoading ? '登录中...' : isSignup ? '注册' : '登录'}
              </RippleButton>
            </FieldGroup>
          </form>
          <div className="flex justify-end items-center w-full">
            {isSignup ? (
              <p className="text-sm text-center">
                已经有账户？
                <RippleButton variant="dim" onClick={() => setIsSignup(false)}>立即登录</RippleButton>
              </p>
            ) : (
              <p className="text-sm text-center">
                需要创建一个账户？
                <RippleButton variant="dim" onClick={() => setIsSignup(true)}>立即注册</RippleButton>
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="flex w-full flex-col gap-3">
            {OAUTH_PROVIDERS.items.map(({ value, label }) => (
              <RippleButton
                key={value}
                className="w-full"
                variant="outline"
                disabled={oauthLoading || emailLoading}
                onClick={() => handleOAuthLogin(value)}
              >
                <>
                  {oauthLoading ? <Spinner /> : value === OAUTH_PROVIDERS.GITHUB ? <GithubIcon /> : <GoogleIcon />}
                  {label}
                </>
              </RippleButton>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}