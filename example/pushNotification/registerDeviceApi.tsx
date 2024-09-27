interface RegisterDeviceRequest {
  token: string;
  deviceId: string;
  xPlatformCode: string;
}

export async function validateRegisterDeviceRequest(
  request: RegisterDeviceRequest,
  accessToken: string
) {
  const params = {
    token: request.token,
  };
  await fetch("https://auth.likeminds.community/user/device/push", {
    method: "POST",
    headers: {
      "x-device-id": request.deviceId,
      "x-platform-code": request.xPlatformCode,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(params),
  })
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      return true;
    })
    .catch((error) => console.error(error));
}
