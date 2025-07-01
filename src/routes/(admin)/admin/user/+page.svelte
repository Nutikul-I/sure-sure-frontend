<script lang="ts">
	import Swal from 'sweetalert2';
	import { onMount } from 'svelte';
	import type { UserData } from './+page.server.js';
	import type { PackageData } from './+page.server.js';
	import cookie from 'cookie';

	import Switch from '$lib/components/ui/switch/Switch2.svelte';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { PUBLIC_BACKEND_API_KEY } from '$env/static/public';

	let listUser = [];
	let listPackages = [];
	let search = '';

	let id = '';
	let name_th = '';
	let package_id = '';
	let package_change_date = '';
	let quota_left = '';
	let quota_all = '';
	let is_active = false;
	onMount(async () => {
		await Promise.all([GetUser(), GetPackage()])
	});
	async function GetUser() {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/user/get`, config);
		const data = await result.json();
		listUser = data?.data.filter(e=> !search || (`${e.id} ${e.name_th}`).includes(search)) || [];
	}
	async function GetPackage() {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/package/get`, config);
		const data = await result.json();
		listPackages = data.data?.filter((e) => e.amount > 0) || [];
	}
	async function UpdateUser() {
		var config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			},
			body: JSON.stringify({
				id: parseInt(id),
				package_id: parseInt(package_id),
				is_active: is_active ? 1 : 0
			})
		};
		var result = await fetch(`${PUBLIC_API_ENDPOINT}/user/update`, config);
		var data = await result.json();

		if(listUser.find(e=>e.id === id)?.package_id !== package_id){
		const selectPackage = listPackages.find(e=>e.id === package_id);
		const updatedPackageChangeDate = new Date(package_change_date);
		updatedPackageChangeDate.setDate(
			updatedPackageChangeDate.getDate() + (Number(selectPackage?.duration) || 0)
		);

		config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			},
			body: JSON.stringify({
				package_id: package_id,
				id: id,
				quota_left: quota_left + selectPackage?.quota_limit,
				quota_all: quota_all + selectPackage?.quota_limit,
				package_change_date: updatedPackageChangeDate
			})
		};
		result = await fetch(`${PUBLIC_API_ENDPOINT}/user/update`, config);

		data = await result.json();
	}
		if (data.message === 'Success') {
			Swal.fire({
					width: '26em',
					imageUrl:
						'https://img2.pic.in.th/pic/download-2a2d3a381ecc577a3.png',
					imageWidth: 72,
					imageHeight: 72,
					imageAlt: 'Custom image',
					showCloseButton: true,
					title: 'สำเร็จ',
					text: 'แก้ไขู้ใช้สำเร็จ',
					confirmButtonText: 'ตกลง',
					customClass: {
						container: 'mb-0 pt-2 text-md',
						popup: 'justify-item-center',
						image: 'mb-2',
						title: 'text-xl pt-1',
						htmlContainer: 'text-md pt-2',
						actions: 'w-100 px-3 mt-2',
						confirmButton: 'btn btn-primary bg-primary text-white w-100'
					}
				}).then(()=>{
					window.location.reload();
				})
				
		} else if (data.message === 'Duplicate Request') {
			Swal.fire({
				width: '26em',
				imageUrl:
					'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'กรุณาตรวจสอบข้อมูล',
				text: 'ข้อมูลร้านค้านี้มีอยู่แล้วในระบบ',
				confirmButtonText: 'ตกลง',
				customClass: {
					container: 'mb-0 pt-2 text-md',
					image: 'mb-2',
					title: 'text-xl pt-1',
					htmlContainer: 'text-md pt-2',
					actions: 'w-100 px-3 mt-2',
					confirmButton: 'btn btn-primary bg-primary text-white w-100'
				}
			});
			return false;
		} else {
			Swal.fire({
				width: '26em',
				imageUrl:
					'https://img5.pic.in.th/file/secure-sv1/download-15556b299eaa25ad1.png',
				imageWidth: 72,
				imageHeight: 72,
				imageAlt: 'Custom image',
				showCloseButton: true,
				title: 'กรุณาตรวจสอบข้อมูล',
				text: 'ไม่สามารถแก้ไขข้อมูลได้',
				confirmButtonText: 'ตกลง',
				customClass: {
					container: 'mb-0 pt-2 text-md',
					image: 'mb-2',
					title: 'text-xl pt-1',
					htmlContainer: 'text-md pt-2',
					actions: 'w-100 px-3 mt-2',
					confirmButton: 'btn btn-primary bg-primary text-white w-100'
				}
			});
			return false;
		}
	}
</script>

<div class="p-3">
	<h4 class="h4 fw-bold">รายชื่อผู้ใช้</h4>
	<div class="d-flex mb-3">
			<input
				type="text"
				placeholder="รหัสลูกค้า, ชื่อ-นามสกุล"
				class="form-control w-72 me-2"
				bind:value={search}
			/>
			<button class="btn btn-primary bg-primary me-2" on:click={GetUser}>ค้นหา</button>
			<button class="btn btn-outline"
				on:click={() => {
					search = '';
					GetUser();
				}}>ล้าง</button
			>
	</div>
	<div class="table-responsive">
		<table class="table table-hover">
			<thead>
				<tr class="bg-secondary-subtle">
					<th class="text-center">ลำดับ</th>
					<th>รหัสลูกค้า</th>
					<th>อีเมล</th>
					<th>ชื่อ-นามสกุล</th>
					<th>ประเภทลูกค้า</th>
					<th>แพ็กเก็จที่สมัคร</th>
					<th class="text-center">จำนวนเหลือใช้</th>
					<th class="text-center">จำนวนที่ใช้ไป</th>
					<th class="text-center">วันหมดอายุแพ็กเก็จ</th>
					<th class="text-center">สถานะ</th>
					<th></th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if listUser.length === 0}
					<tr><td colspan="11">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each listUser as item, index}
						<tr class="text-start">
							<th class="text-center">{index + 1}</th>
							<td>{item.id.toString().padStart('0',5)}</td>
							<td title={item.email}>{item.email}</td>
							<td title={item.name_th}>{item.name_th}</td>
							<td>{item.user_type}</td>
							<td title={item.package_id}>{item.package_id}</td>
							<td class="text-end">{item.quota_left.toLocaleString()}</td>
							<td class="text-end">{(item.quota_all - item.quota_left).toLocaleString()}</td>
							<td class="text-center">{new Date(item.package_change_date).toLocaleDateString('en-EN', {day: '2-digit',month: '2-digit',year: 'numeric'}) || '-'}</td>
							<td>
								<small class="text-nowrap px-2 rounded-pill {item.is_active ? 'badge-success' : 'badge-danger'}">{item.is_active ? 'ACTIVE' : 'DEACTIVE'}</small>
							</td>
							<td class="p-1 sm:p-2">
								<svg
									on:click={() => {
										id = item.id;
										name_th = item.name_th;
										package_id = item.package_id;
										is_active = item.is_active;
										package_change_date = item.package_change_date;
										quota_left = item.quota_left;
										quota_all = item.quota_all;
										const modal = document.getElementById('update');
										modal.showModal();
									}}
									class="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
									/>
								</svg>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<!-- <div class="grid w-full sm:w-auto mt-3">
			<div class="flex items-center justify-between w-full">
				<div class="text-sm ">หน้าที่ {currentPage} จากทั้งหมด {totalPages} หน้า</div>

				<div class="flex items-center space-x-2">
					<select
						class="select-sm w-full max-w-xs h-1 rounded-md bg-white"
						bind:value={limit}
						on:change={firstPage}
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={15}>15</option>
						<option value={20}>20</option>
						<option value={25}>25</option>
						<option value={30}>30</option>
					</select>

					<button
						class="btn btn-xs sm:btn-sm btn-outline"
						on:click={prevPage}
						disabled={currentPage === 1}
					>
						ย้อนกลับ
					</button>
					<button
						class="btn btn-xs sm:btn-sm btn-outline"
						on:click={nextPage}
						disabled={currentPage === totalPages}
					>
						ต่อไป
					</button>
				</div>
			</div>
		</div> -->
	</div>
</div>

<dialog id="update" class="modal">
	<div class="modal-box bg-white w-11/12 max-w-md">
		<div class="form-control">
			<h2 class="text-2xl font-bold mb-4 text-primary">แก้ไข</h2>
			<div></div>
			<label class="label">
				<span class="label-text text-black w-2/5">ชื่อ-นามสกุล:</span>
				<input
					type="text"
					class="input input-bordered !border-black bg-white disabled:bg-white disabled:text-black w-80"
					disabled
					bind:value={name_th}
				/>
			</label>
			<label class="label">
				<span class="label-text text-black w-2/5">แพ็กเก็จ:</span>

				<select
					class="select max-w-xs w-80 bg-white overflow-y-auto border border-gray-900"
					bind:value={package_id}
				>
					{#each listPackages as pkgdata}
						<option value={pkgdata.id}>{pkgdata.package_name}</option>
					{/each}
				</select>
			</label>

			<label class="label cursor-pointer bg-white flex">
				<span class="label-text text-black w-2/5">สถานะ</span>
				<Switch
					bind:checked={is_active}
					on:change={(e) => {
						is_active = e.target.checked;
					}}
				/>
			</label>

			<div class="modal-action">
				<form method="dialog" class="flex space-x-2">
					<button class="btn border border-gray-500 text-black">ปิด</button>
					<button
						class="btn bg-primary text-white btn-primary hover:bg-[#050680]"
						on:click={UpdateUser}>บันทึก</button
					>
				</form>
			</div>
		</div>
	</div>
</dialog>

<style>

	.badge-success {
		@apply border border-success;
		background-color: #dcfae6;
		color: #17b26a;
	}

	.badge-danger {
		@apply border border-gray-500;
		background-color: #f9fafb;
		color: #61646c;
	}
</style>
