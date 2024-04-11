<template>
  <div
    class="box p-4 rounded-md max-w-sm flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-[600px]:p-6"
  >
    <router-link :to="{ name: 'Home' }" class="w-2/3 mb-5 min-[600px]:w-1/2">
      <img src="@/assets/images/swippl-logo-light.png" alt="Swippl logo" />
    </router-link>
    <h1
      class="text-base mb-1 min-[450px]:text-lg min-[600px]:text-xl min-[1330px]:text-2xl"
    >
      Zresetuj swoje hasło
    </h1>
    <p class="text-xs mb-4 min-[1330px]:text-sm">
      Na podany adres e-mail zostanie wysłane nowe hasło, które pozwoli ci się
      zalogować na swoje konto.
    </p>
    <form action="" id="resetPasswordForm" class="w-full" @submit="onSubmit">
      <div class="mb-3">
        <label-field :label-for="'email'"
          >Adres e-mail powiązany z kontem</label-field
        >
        <input-text
          name="email"
          type="email"
          :placeholder="'kowalski@example.com'"
          :input-props="{ minlength: 3, maxlength: 254 }"
          :input-id="'email'"
        ></input-text>
      </div>
      <form-button
        class="w-full mb-2"
        :form-id="'resetPasswordForm'"
        :button-title="'Zresetuj hasło'"
      ></form-button>
      <div class="text-xs text-center min-[1330px]:text-sm">
        <p>
          Aby powrócić na stronę główną,
          <router-link
            :to="{ name: 'Home' }"
            class="font-medium hover:text-primaryDark hover:underline active:text-primaryDark active:underline"
            >kliknij tutaj.</router-link
          >
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { object, string } from "yup";
import { useUserStore } from "@/stores/UserStore";
import InputText from "@/components/form/InputText.vue";
import LabelField from "@/components/form/LabelField.vue";
import FormButton from "@/components/buttons/FormButton.vue";

const userStore = useUserStore();

const { resetUserPassword } = userStore;

const { handleSubmit } = useForm({
  validationSchema: object({
    email: string()
      .required("Adres e-mail jest wymagany")
      .email("Niepoprawny adres e-mail")
      .min(3, "Adres e-mail jest zbyt krótki")
      .max(254, "Adres e-mail jest zbyt długi"),
  }),
});

const onSubmit = handleSubmit((values) => {
  resetUserPassword({ email: values.email });
});
</script>

<style scoped>
.box {
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.2);
}
</style>
