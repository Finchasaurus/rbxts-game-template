const ReplicatedFirst = game.GetService("ReplicatedFirst");
const Players = game.GetService("Players");

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");

const loadingScreen = new Instance("ScreenGui");
loadingScreen.Name = "LoadingScreenPlaceholder";
loadingScreen.IgnoreGuiInset = true;

const frame = new Instance("Frame");
frame.Size = UDim2.fromScale(1, 1);
frame.BackgroundColor3 = new Color3(0, 0, 0);

frame.Parent = loadingScreen;
loadingScreen.Parent = playerGui;

ReplicatedFirst.RemoveDefaultLoadingScreen();
