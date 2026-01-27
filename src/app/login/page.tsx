/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 14:12:20
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-27 13:43:50
 * @Description: 登录页
 */
"use client";
import { useRouter } from '@bprogress/next/app';
import { Check, CircleInfo, CircleXmark, Envelope, Eye, EyeSlash, Lock } from '@gravity-ui/icons';
import { Button, Card, Description, FieldError, Form, InputGroup, Label, Link, Separator, Spinner, TextField, toast } from '@heroui/react';
import Image from 'next/image';
import { type FormEvent, useState } from 'react';

import { OAUTH_PROVIDERS } from '@/enums';
import { GithubIcon, GoogleIcon } from '@/lib/icons'
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type EmailForm = {
  email: string;
  password: string;
}

export default function Login() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [emailLoading, setEmailLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  // 是否注册
  const [isSignup, setIsSignup] = useState(false);
  // 是否显示密码
  const [showPassword, setShowPassword] = useState(false);

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Partial<EmailForm> = {};
    formData.forEach((value, key) => {
      data[key as keyof EmailForm] = value.toString();
    });

    setEmailLoading(true);

    // ✅ 提取公共 Supabase 调用逻辑
    const authPromise = (async () => {
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp(data as EmailForm);
      } else {
        result = await supabase.auth.signInWithPassword(data as EmailForm);
      }

      if (result.error) {
        throw result.error; // 统一抛出错误
      }
      return result.data;
    })();

    toast.promise(authPromise, {
      loading: isSignup ? '注册中...' : '登录中...',
      success: () => {
        setEmailLoading(false);
        if (isSignup) {
          form.reset();
          setIsSignup(false);
          return '提交成功，请到邮箱验证后登录';
        } else {
          router.refresh();
          return '登录成功，欢迎回来！';
        }
      },
      error: (err: { message: string }) => {
        setEmailLoading(false);
        return `${isSignup ? '注册失败，请稍后重试' : '登录失败，请稍后重试'}：${err.message}`
      },
    });

    setTimeout(() => {
      toast.clear();
    }, 2000)
  };

  // 谷歌或者 Github 登录
  const handleOAuthLogin = async (provider: typeof OAUTH_PROVIDERS.valueType) => {
    setOauthLoading(true);
    // 加一个短提示，避免跳转等待时间过长无反馈
    toast("登录中...", {
      timeout: 2000,
      indicator: <CircleInfo />,
    });

    // 错误提示
    const errorToast = (msg: string) => {
      toast.danger("登录失败，请稍后重试", {
        description: msg,
        timeout: 2000,
        indicator: <CircleXmark />,
      })
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: process.env.NEXT_PUBLIC_APP_URL,
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
      <Card className="w-lg max-w-md shadow-md">
        <Card.Header>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              width={42}
              height={42}
              alt="Logo"
              className="rounded-lg"
            />
            <div className="flex flex-col">
              <p className="text-lg font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</p>
              <p className="text-sm text-muted">从这里开始，马上登录！</p>
            </div>
          </div>
        </Card.Header>
        <Separator />
        <Card.Content>
          <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <TextField
              isRequired
              name="email"
              type="email"
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "请输入合法的邮箱地址!";
                }
                return null;
              }}
            >
              <Label>邮箱地址</Label>
              <InputGroup variant="secondary">
                <InputGroup.Prefix>
                  <Envelope className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input aria-label="Email" placeholder="请输入邮箱地址" />
              </InputGroup>
              <FieldError />
            </TextField>
            <TextField
              isRequired
              minLength={6}
              maxLength={12}
              name="password"
              type="password"
              validate={(value) => {
                if (value.length < 6 || value.length > 12) {
                  return "请输入长度为6-12的字符串.";
                }
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value)) {
                  return "密码必须包含大小写字母和数字";
                }
                return null;
              }}
            >
              <Label>密码</Label>
              <InputGroup variant="secondary">
                <InputGroup.Prefix>
                  <Lock className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input type={showPassword ? 'text' : 'password'} aria-label="Password" placeholder="请输入密码" />
                <InputGroup.Suffix className="pr-0">
                  <Button
                    isIconOnly
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    size="sm"
                    variant="ghost"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye className="size-4" /> : <EyeSlash className="size-4" />}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
              <Description>密码必须包含大小写字母和数字.</Description>
              <FieldError />
            </TextField>
            <Button type="submit" isDisabled={oauthLoading || emailLoading} isPending={emailLoading} className="w-full">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : <Check />}
                  {isPending ? (isSignup ? '注册中...' : '登录中...') : (isSignup ? '注册' : '登录')}
                </>
              )}
            </Button>
          </Form>
          <div className="flex justify-end items-center w-full mt-2">
            {isSignup ? (
              <p className="text-sm text-center">
                已经有账户？
                <Link className="underline-offset-4 hover:underline" onClick={() => setIsSignup(false)}>立即登录</Link>
              </p>
            ) : (
              <p className="text-sm text-center">
                需要创建一个账户？
                <Link className="underline-offset-4 hover:underline" onClick={() => setIsSignup(true)}>立即注册</Link>
              </p>
            )}
          </div>
        </Card.Content>
        <Separator />
        <Card.Footer className="flex-col gap-2">
          <div className="flex w-full flex-col gap-3">
            {OAUTH_PROVIDERS.items.map(({ value, label }) => (
              <Button
                key={value}
                className="w-full"
                variant="outline"
                isDisabled={oauthLoading || emailLoading}
                isPending={oauthLoading}
                onPress={() => handleOAuthLogin(value)}
              >
                {({ isPending }) => (
                  <>
                    {isPending ? <Spinner size='sm' /> : value === OAUTH_PROVIDERS.GITHUB ? <GithubIcon /> : <GoogleIcon />}
                    {label}
                  </>
                )}
              </Button>
            ))}
          </div>
        </Card.Footer>
      </Card>
    </div>
  )
}