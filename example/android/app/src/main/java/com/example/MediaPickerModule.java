package com.example;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.ArrayList;
import java.util.List;
import android.util.Log;

public class MediaPickerModule extends ReactContextBaseJavaModule {
    private static final String TAG = "MediaPickerModule";
    private final ReactApplicationContext reactContext;
    private Promise pickerPromise;
    private ActivityResultLauncher<Intent> pickMultipleMediaLauncher;

    public MediaPickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(new MediaPickerActivityEventListener());
    }

    private class MediaPickerActivityEventListener extends BaseActivityEventListener {
        public void onHostResume() {
            initializeLaunchers();
        }
    }

    private void initializeLaunchers() {
        Activity activity = getCurrentActivity();
        if (activity instanceof FragmentActivity) {
            FragmentActivity fragmentActivity = (FragmentActivity) activity;
            if (pickMultipleMediaLauncher == null) {
                pickMultipleMediaLauncher = fragmentActivity.registerForActivityResult(
                        new ActivityResultContracts.StartActivityForResult(),
                        result -> {
                            if (pickerPromise != null) {
                                if (result.getResultCode() != Activity.RESULT_OK) {
                                    pickerPromise.reject("PICKER_ERROR", "Failed picking media.");
                                } else {
                                    Intent data = result.getData();
                                    if (data != null) {
                                        List<String> uris = new ArrayList<>();
                                        if (data.getClipData() != null) {
                                            for (int i = 0; i < data.getClipData().getItemCount(); i++) {
                                                uris.add(data.getClipData().getItemAt(i).getUri().toString());
                                            }
                                        } else if (data.getData() != null) {
                                            uris.add(data.getData().toString());
                                        }
                                        pickerPromise.resolve(uris.toString());
                                    } else {
                                        pickerPromise.reject("PICKER_ERROR", "No media selected");
                                    }
                                }
                                pickerPromise = null;
                            }
                        }
                );
            }
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "MediaPicker";
    }

    @ReactMethod
    public void pickImage(Promise promise) {
        pickerPromise = promise;
        Intent intent = new Intent(MediaStore.ACTION_PICK_IMAGES);
        intent.setType("image/*");
        intent.putExtra(MediaStore.EXTRA_PICK_IMAGES_MAX, 3);
        launchPicker(intent);
    }

    @ReactMethod
    public void pickVideo(Promise promise) {
        pickerPromise = promise;
        Intent intent = new Intent(MediaStore.ACTION_PICK_IMAGES);
        intent.setType("video/*");
        intent.putExtra(MediaStore.EXTRA_PICK_IMAGES_MAX, 3);
        launchPicker(intent);
    }

    @ReactMethod
    public void pickMultipleImagesOrVideos(Promise promise) {
        pickerPromise = promise;
        Intent intent = new Intent(MediaStore.ACTION_PICK_IMAGES);
        intent.setType("image/*,video/*");
        intent.putExtra(MediaStore.EXTRA_PICK_IMAGES_MAX, 3);
        launchPicker(intent);
    }

    private void launchPicker(Intent intent) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            if (pickMultipleMediaLauncher != null) {
                pickMultipleMediaLauncher.launch(intent);
            } else {
                pickerPromise.reject("PICKER_ERROR", "Launcher not initialized");
            }
        } else {
            pickerPromise.reject("NO_ACTIVITY", "Activity doesn't exist");
        }
    }
}
