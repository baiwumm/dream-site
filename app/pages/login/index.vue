<script setup lang="ts">
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`;

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
  loading.value = true;
  await auth
    .signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    })
    .then(() => {
      loading.value = false;
    });
};

// 谷歌登录
const googleLogin = async () => {
  toast.add({ title: "此功能正在开发中，敬请期待." });
};

// 提交回调
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  toast.add({ title: "此功能正在开发中，敬请期待." });
}
</script>

<template>
  <div class="flex flex-col justify-center items-center" style="height: calc(100vh - 11rem)">
    <div
      class="cursor-pointer card-base animated-border animate-fade after:border-green-500/50 dark:after:border-green-400/50 shadow-md dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)] m-auto w-[450px]"
      shadow="hover"
      @mouseenter="($event.target as HTMLElement)?.classList?.add('hovered')"
    >
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
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
                @click="showPsd = !showPsd"
              />
            </template>
          </UInput>
        </UFormField>
        <UButton color="neutral" size="xl" type="submit" class="w-full cursor-pointer justify-center">登录</UButton>
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
