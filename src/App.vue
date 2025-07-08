<template>
  <v-app>
    <v-container>
      <!-- Заголовок и кнопка добавления -->
      <v-row>
        <v-col>
          <h1>Управление учетными записями</h1>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="addAccount">
            Добавить запись
          </v-btn>
        </v-col>
      </v-row>

      <!-- Подсказка для поля метки -->
      <v-row>
        <v-col>
          <v-alert type="info" density="compact">
            Введите метки через точку с запятой (;). Например: метка1;метка2
          </v-alert>
        </v-col>
      </v-row>

      <!-- Список учетных записей -->
      <v-row v-for="account in accounts" :key="account.id">
        <v-col>
          <v-card class="mb-4">
            <v-card-text>
              <v-row>
                <!-- Поле Метка -->
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Метка"
                    v-model="account.labelInput"
                    @blur="updateLabels(account)"
                    :error="account.errors.labels"
                    placeholder="метка1;метка2"
                    maxlength="50"
                  ></v-text-field>
                </v-col>

                <!-- Тип записи -->
                <v-col cols="12" sm="3">
                  <v-select
                    label="Тип записи"
                    v-model="account.type"
                    :items="[{ title: 'LDAP', value: 'LDAP' }, { title: 'Локальная', value: 'Local' }]"
                    @update:modelValue="updateAccount(account)"
                    :error="account.errors.type"
                  ></v-select>
                </v-col>

                <!-- Логин -->
                <v-col cols="12" sm="3">
                  <v-text-field
                    label="Логин"
                    v-model="account.login"
                    @blur="updateAccount(account)"
                    :error="account.errors.login"
                    maxlength="100"
                  ></v-text-field>
                </v-col>

                <!-- Пароль (отображается только для Локальной записи) -->
                <v-col cols="12" sm="2" v-if="account.type === 'Local'">
                  <v-text-field
                    label="Пароль"
                    v-model="account.password"
                    @blur="updateAccount(account)"
                    :error="account.errors.password"
                    maxlength="100"
                    type="password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="removeAccount(account.id)">
                Удалить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAccountStore } from './stores/accounts';

// Интерфейс для учетной записи с дополнительными полями для валидации
interface AccountForm {
  id: string;
  labels: { text: string }[];
  labelInput: string; // Временное поле для ввода меток
  type: 'LDAP' | 'Local';
  login: string;
  password: string | null;
  errors: {
    labels: boolean;
    type: boolean;
    login: boolean;
    password: boolean;
  };
}

const store = useAccountStore();

// Вычисляемое свойство для добавления временных полей
const accounts = computed(() => {
  return store.accounts.map((account) => ({
    ...account,
    labelInput: account.labels.map((label) => label.text).join(';'),
    errors: {
      labels: false,
      type: !account.type,
      login: !account.login,
      password: account.type === 'Local' && !account.password,
    },
  }));
});

// Добавление новой записи
const addAccount = () => {
  store.addAccount();
};

// Удаление записи
const removeAccount = (id: string) => {
  store.removeAccount(id);
};

// Обновление меток
const updateLabels = (account: AccountForm) => {
  const labels = account.labelInput
    .split(';')
    .filter((label) => label.trim())
    .map((label) => ({ text: label.trim() }));
  store.updateAccount(account.id, { labels });
  validateAccount(account);
};

// Валидация и обновление записи
const updateAccount = (account: AccountForm) => {
  const updated = {
    type: account.type,
    login: account.login,
    password: account.type === 'Local' ? account.password : null,
  };
  store.updateAccount(account.id, updated);
  validateAccount(account);
};

// Валидация полей
const validateAccount = (account: AccountForm) => {
  account.errors.type = !account.type;
  account.errors.login = !account.login;
  account.errors.password = account.type === 'Local' && !account.password;
};
</script>