<script setup lang="ts">
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const config = useRuntimeConfig();
const redirectTo = `${config.public.baseUrl}/confirm`;

watchEffect(() => {
  if (user.value) {
    navigateTo("/");
  }
});

const toast = useToast();

definePageMeta({
  title: "用户登录",
});

const loading = ref(false);
const showPsd = ref(false);

const schema = z.object({
  email: z.email("请输入有效的邮箱地址."),
  password: z
    .string("请输入长度为6-12的字符串.")
    .min(6, "密码长度至少为6个字符")
    .max(12, "密码长度不能超过12个字符")
    .regex(/^[a-zA-Z0-9]+$/, "密码只能包含字母和数字"), // 可选：限制字符类型
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

// Github 登录
const githubLogin = async () => {
  try {
    loading.value = true;
    await auth
      .signInWithOAuth({
        provider: "github",
        options: { redirectTo },
      })
      .then(() => {
        toast.add({
          title: "登录成功",
          description: "正在为您跳转...",
          color: "success",
        });
        loading.value = false;
      });
  } catch (err: any) {
    toast.add({
      title: "登录失败",
      description: err.message,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

// 谷歌登录
const googleLogin = async () => {
  try {
    loading.value = true;
    await auth
      .signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      .then(() => {
        toast.add({
          title: "登录成功",
          description: "正在为您跳转...",
          color: "success",
        });
        loading.value = false;
      });
  } catch (err: any) {
    toast.add({
      title: "登录失败",
      description: err.message,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const isRegister = ref(false);

// 提交回调
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    if (isRegister.value) {
      // 注册
      const { error } = await auth.signUp({
        email: event.data.email,
        password: event.data.password,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        const errorMessage =
          error.message === "User already registered"
            ? "该邮箱已被注册"
            : error.message === "Password should be at least 6 characters"
              ? "密码长度至少为6个字符"
              : error.message;
        toast.add({
          title: "注册失败",
          description: errorMessage,
          color: "error",
        });
        return;
      }

      toast.add({
        title: "注册成功",
        description: "验证邮件已发送到您的邮箱，请查收并验证",
        color: "success",
      });
      isRegister.value = false;
    } else {
      // 登录
      const { error } = await auth.signInWithPassword({
        email: event.data.email,
        password: event.data.password,
      });

      if (error) {
        const errorMessage = error.message === "Invalid login credentials" ? "邮箱或密码错误" : error.message;
        toast.add({
          title: "登录失败",
          description: errorMessage,
          color: "error",
        });
        return;
      }

      toast.add({
        title: "登录成功",
        description: "正在为您跳转...",
        color: "success",
      });

      navigateTo("/admin");
    }
  } catch (err: any) {
    toast.add({
      title: isRegister.value ? "注册失败" : "登录失败",
      description: err.message,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center" style="height: calc(100vh - 11rem)">
    <div
      class="cursor-pointer card-base animated-border animate-fade after:border-green-500/50 dark:after:border-green-400/50 shadow-md dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)] m-auto w-[450px]"
      shadow="hover"
      @mouseenter="($event.target as HTMLElement)?.classList?.add('hovered')"
    >
      <div class="flex font-black text-3xl justify-center">选择登录方式</div>
      <UForm :schema="schema" :state="state" class="space-y-4 mt-2" @submit="onSubmit">
        <UFormField label="邮箱" name="email" required>
          <UInput size="xl" icon="i-lucide-at-sign" v-model="state.email" placeholder="请输入邮箱" class="w-full" />
        </UFormField>
        <UFormField label="密码" name="password" required>
          <UInput
            size="xl"
            icon="ri:lock-line"
            v-model="state.password"
            placeholder="请输入密码"
            :type="showPsd ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                :icon="showPsd ? 'ri:eye-off-line' : 'ri:eye-line'"
                :aria-label="showPsd ? 'Hide password' : 'Show password'"
                :aria-pressed="showPsd"
                aria-controls="password"
                :loading="loading"
                @click="showPsd = !showPsd"
              />
            </template>
          </UInput>
        </UFormField>
        <UButton
          color="neutral"
          size="xl"
          type="submit"
          class="w-full cursor-pointer justify-center"
          :loading="loading"
        >
          {{ isRegister ? "立即注册" : "登录" }}
        </UButton>
        <div class="flex justify-end mt-2">
          <UButton color="neutral" variant="link" @click="isRegister = !isRegister" class="cursor-pointer">
            {{ isRegister ? "已有账号？去登录" : "没有账号？去注册" }}
          </UButton>
        </div>
      </UForm>
      <USeparator label="快捷登录" class="py-4" />
      <div class="grid grid-cols-2 gap-4">
        <UButton
          icon="i-simple-icons-github"
          size="xl"
          color="neutral"
          variant="outline"
          @click="githubLogin"
          class="cursor-pointer justify-center"
          :loading="loading"
          >Github</UButton
        >
        <UButton
          icon="i-simple-icons-google"
          size="xl"
          color="neutral"
          variant="outline"
          @click="googleLogin"
          class="cursor-pointer justify-center"
          :loading="loading"
          >Google</UButton
        >
      </div>
    </div>
  </div>
</template>
