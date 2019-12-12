<template>
  <div>
    <v-container>
      <v-card>
        <v-container>
          <v-subheader>회원가입</v-subheader>
          <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
            <v-text-field
              v-model="email"
              label="이메일"
              type="email"
              :rules="emailRules"
              requred
             />
             <v-text-field
               v-model="password"
               label="비밀번호"
               type="password"
               :rules="passwordRules"
               requred
              />
              <v-text-field
                v-model="passwordCheck"
                label="비밀번호확인"
                type="password"
                :rules="passwordCheckRules"
                requred
               />
               <v-text-field
                 v-model="nickname"
                 label="닉네임"
                 type="nickname"
                 :rules="nicknameRules"
                 requred
                />
                <v-checkbox
                v-model="terms"
                required
                :rules="[v => !!v || '약관에 동의해야 합니다.']"
                label="제로초 말을 잘 들을 것을 약속합니다!"
                />
                <v-btn color="green" type="submit">가입하기</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>

  export default {
    components: {

    },
    data() {
      return {
        valid: false, // 밑에 조건들이 다 들어갔는지
        email: '',
        password: '',
        passwordCheck: '',
        nickname: '',
        terms: false, // 약관동의
        emailRules: [
          v => !!v || '이메일은 필수입니다.',
          v => /.+@./.test(v) || '이메일이 유효하지 않습니다.',
        ],
        nicknameRules: [
          v => !!v || '닉네임은 필수입니다.',
        ],
        passwordRules: [
          v => !!v || '비밀번호는 필수입니다.',
        ],
        passwordCheckRules: [
          v => !!v || '비밀번호 확인은은 필수입니다.',
          v => v === this.password || '비밀번호가 일치하지 않습니다.',
        ],
      }
    },
    methods: {
      onSubmitForm() {
        if(this.$refs.form.validate()) {
          alert('회원가입 시도!');
        } else {
          alert('폼이 유효하지 않습니다.');
        }
        console.log(this.valid);
      }
    },

    head() {
      return {
        title: '회원가입',
      }
    }
  }
</script>

<style>
</style>
