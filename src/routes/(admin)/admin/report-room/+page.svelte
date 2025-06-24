<script lang="ts">
	import { onMount } from 'svelte';
	import type { RoomMerchantData } from './+page.server.js';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';
	import { PUBLIC_BACKEND_API_KEY } from '$env/static/public';

	let listRooms = [];
	let listUser = [];
	let search = '';
	onMount(async () => {
		await Promise.all([GetRoom(), GetUser()]);
	});
	async function GetRoom() {
		const config = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'true',
				apikey: PUBLIC_BACKEND_API_KEY
			}
		};
		const result = await fetch(`${PUBLIC_API_ENDPOINT}/room2/get`, config);
		const data = await result.json();
		listRooms =
			data?.data.filter((e) => !search || `${e.room_name} ${e.name_th}`.includes(search)) || [];
	}
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
		listUser = data?.data || [];
	}
</script>

<div class="p-3">
	<h4 class="h4 fw-bold">รายงานห้องของลูกค้า</h4>
	<div class="d-flex mb-3">
		<input
			type="text"
			placeholder="ชื่อห้อง, ชื่อ-นามสกุล"
			class="form-control w-72 me-2"
			bind:value={search}
		/>
		<button class="btn btn-primary bg-primary me-2" on:click={GetRoom}>ค้นหา</button>
		<button
			class="btn btn-outline"
			on:click={() => {
				search = '';
				GetRoom();
			}}>ล้าง</button
		>
	</div>

	<div class="table-responsive">
		<table class="table table-hover">
			<thead>
				<tr class="bg-secondary-subtle">
					<th class="text-center">ลำดับ</th>
					<th>ชื่อห้อง</th>
					<th>รหัสลูกค้า</th>
					<th>ชื่อ-นามสกุล</th>
					<th class="text-end">โควตาที่ใช้</th>
					<th class="text-end">จำนวนเงินขั้นต่ำที่ได้รับ</th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if listRooms.length === 0}
					<tr><td colspan="7">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each listRooms as item, index}
						<tr class="text-start">
							<td class="text-center">{index + 1}</td>
							<td title={item.room_name}>{item.room_name}</td>
							<td>{item.user_id}</td>
							<td title={listUser?.find(e=>e.id === item.user_id)?.name_th || "-"}>{listUser?.find(e=>e.id === item.user_id)?.name_th || "-"}</td>
							<td class="text-end">{item.quota_used}</td>
							<td class="text-end">{item.min_receive.toFixed(2)}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<!-- <div class="grid w-full sm:w-auto mt-3">
			<div class="flex items-center justify-between w-full">
				<div class="text-sm">หน้าที่ {currentPage} จากทั้งหมด {totalPages} หน้า</div>

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
