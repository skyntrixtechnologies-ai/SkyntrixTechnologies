import { useLayoutEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch as RNSwitch, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { adminPost, adminPut } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { Button, Field, TextField } from "../../components/Ui";
import Screen from "../../components/Screen";
import { colors, fonts } from "../../theme/colors";

const toFormValues = (fields, row) => {
  const values = {};
  for (const f of fields) {
    const v = row?.[f.name];
    if (f.type === "tags") values[f.name] = Array.isArray(v) ? v.join(", ") : "";
    else if (f.type === "switch") values[f.name] = !!v;
    else values[f.name] = v !== undefined && v !== null ? String(v) : "";
  }
  return values;
};

export default function CrudFormScreen({ route, navigation }) {
  const { config, editingId, row } = route.params;
  const { singular, apiPath, fields, imageField, imagePreviewKey } = config;
  const { toast } = useToast();

  const [form, setForm] = useState(() => toFormValues(fields, row));
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ title: editingId ? `Edit ${singular}` : `New ${singular}` });
  }, [navigation, editingId, singular]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      toast.error("Photo library permission is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets?.[0]) setImage(result.assets[0]);
  };

  const buildFormData = () => {
    const fd = new FormData();
    for (const f of fields) {
      const v = form[f.name];
      if (v === undefined || v === null) continue;
      if (f.type === "tags") {
        String(v).split(",").map((s) => s.trim()).filter(Boolean).forEach((t) => fd.append(f.name, t));
        continue;
      }
      if (f.type === "switch") {
        fd.append(f.name, v ? "true" : "false");
        continue;
      }
      fd.append(f.name, v);
    }
    if (image) {
      const name = image.fileName || image.uri.split("/").pop() || "upload.jpg";
      const match = /\.(\w+)$/.exec(name);
      const type = match ? `image/${match[1] === "jpg" ? "jpeg" : match[1]}` : "image/jpeg";
      fd.append(imageField, { uri: image.uri, name, type });
    }
    return fd;
  };

  const handleSave = async () => {
    if (fields.some((f) => f.required && !String(form[f.name] || "").trim())) {
      setError(`${singular}: please complete all required fields.`);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = `${apiPath}/admin${editingId ? `/${editingId}` : ""}`;
      const fd = buildFormData();
      if (editingId) await adminPut(url, fd);
      else await adminPost(url, fd);
      toast.ok(`${singular} ${editingId ? "updated" : "created"}`);
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const previewUri = image?.uri || (imagePreviewKey ? row?.[imagePreviewKey] : null);

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
        {fields.map((f) => (
          <View key={f.name}>
            {f.type === "textarea" ? (
              <Field label={f.label} required={f.required} hint={f.hint}>
                <TextField value={form[f.name]} onChangeText={(v) => setField(f.name, v)} multiline numberOfLines={f.rows || 4} placeholder={f.placeholder} />
              </Field>
            ) : f.type === "select" ? (
              <Field label={f.label} required={f.required}>
                <View style={styles.pickerWrap}>
                  <Picker selectedValue={form[f.name]} onValueChange={(v) => setField(f.name, v)}>
                    <Picker.Item label="Select..." value="" />
                    {(f.options || []).map((o) => (
                      <Picker.Item key={o.value} label={o.label} value={o.value} />
                    ))}
                  </Picker>
                </View>
              </Field>
            ) : f.type === "switch" ? (
              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { flex: 1, marginRight: 12 }]}>{f.label}</Text>
                <RNSwitch value={!!form[f.name]} onValueChange={(v) => setField(f.name, v)} trackColor={{ true: colors.primary }} />
              </View>
            ) : f.type === "number" ? (
              <Field label={f.label} required={f.required}>
                <TextField value={String(form[f.name] ?? "")} onChangeText={(v) => setField(f.name, v)} keyboardType="numeric" placeholder={f.placeholder} />
              </Field>
            ) : (
              <Field label={f.label} required={f.required} hint={f.hint}>
                <TextField value={form[f.name]} onChangeText={(v) => setField(f.name, v)} placeholder={f.placeholder} />
              </Field>
            )}
          </View>
        ))}

        {imageField && (
          <Field label={`${singular} image`} hint="Optional — replaces the current image when uploaded.">
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {previewUri ? <Image source={{ uri: previewUri }} style={styles.preview} /> : null}
              <Button title="Choose photo" variant="secondary" onPress={pickImage} style={{ flex: 1 }} />
            </View>
          </Field>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={saving ? "Saving..." : "Save"} onPress={handleSave} loading={saving} style={{ marginTop: 10 }} />
      </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pickerWrap: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.white, overflow: "hidden" },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingVertical: 4 },
  switchLabel: { fontSize: 14, fontFamily: fonts.sansSemiBold, color: colors.ink },
  preview: { width: 56, height: 56, borderRadius: 10 },
  error: { color: colors.danger, fontSize: 13, marginTop: 4, fontFamily: fonts.sans },
});
